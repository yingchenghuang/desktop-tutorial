# encoding: UTF-8
require "json"
require "date"

root = File.expand_path("..", __dir__)
data = File.join(root, "data")
date = "2026-09-06"
errors = []

day = JSON.parse(File.read(File.join(data, "backfill-september-20260906.json")))
entries = day.fetch("entries")
counts = {
  total: entries.length,
  dynamic: entries.count { |e| e["id"].start_with?("current") },
  global: entries.count { |e| e["id"].start_with?("classic-global") },
  german: entries.count { |e| e["id"].start_with?("classic-german") }
}
errors << "public art counts #{counts}" unless counts == {total:20,dynamic:10,global:5,german:5}
required_art = %w[id dedupeKey name cityKeywords media website photo artistStatement artistStatementSource]
errors << "public art missing fields" if entries.any? { |e| required_art.any? { |k| e[k].nil? || (e[k].respond_to?(:empty?) && e[k].empty?) } }
boring = entries.select { |e| (e.fetch("media", []) & %w[人物立像 胸像 騎馬像 基座紀念碑 軍事紀念碑]).any? }
errors << "traditional monument selections #{boring.map { |e| e['id'] }.join(', ')}" unless boring.empty?

comp = JSON.parse(File.read(File.join(data, "competitions.json")))
calls = comp["entries"].select { |e| e["updated"] == date }
errors << "calls #{calls.length}" unless calls.length == 5
errors << "german calls #{calls.count { |e| e['country'].start_with?('德國') }}" unless calls.count { |e| e["country"].start_with?("德國") } == 5
required_call = %w[id dedupeKey name cityKeywords media website photo deadline deadlineTimezone deadlinePrecision organizer eligibility budget applicationFee]
errors << "call missing fields" if calls.any? { |e| required_call.any? { |k| e[k].nil? || (e[k].respond_to?(:empty?) && e[k].empty?) } }

ex = JSON.parse(File.read(File.join(data, "exhibitions.json")))
shows = ex["entries"].select { |e| e["updated"] == date }
errors << "exhibitions #{shows.length}" unless shows.length == 5
required_show = %w[id dedupeKey name cityKeywords media website photo exhibitionType exhibitionStatus startDate endDate edition organizer curator venue admission curatorStatement curatorStatementSource]
errors << "exhibition missing fields" if shows.any? { |e| required_show.any? { |k| e[k].nil? || (e[k].respond_to?(:empty?) && e[k].empty?) } }

art_files = Dir[File.join(data, "backfill-{july,august,september}-*.json")].reject { |p| p.end_with?("manifest.json") }
arts = art_files.flat_map { |p| v=JSON.parse(File.read(p)); v.is_a?(Hash) ? v.fetch("entries", []) : v }
all = arts + comp["entries"] + ex["entries"]
dupes = all.group_by { |e| e["dedupeKey"] }.select { |k,v| k && !k.empty? && v.length > 1 }
errors << "duplicate dedupe keys #{dupes.keys.join(', ')}" unless dupes.empty?
expired = comp["entries"].select { |e| e["deadline"] && DateTime.parse(e["deadline"]) <= DateTime.parse("2026-09-06T04:00:00+08:00") }
errors << "expired active calls #{expired.map { |e| e['id'] }.join(', ')}" unless expired.empty?

puts "#{date} public art #{counts}"
puts "#{date} calls=#{calls.length} germany=#{calls.count { |e| e['country'].start_with?('德國') }} exhibitions=#{shows.length}"
puts "archive totals art=#{arts.length} calls=#{comp['entries'].length} exhibitions=#{ex['entries'].length} duplicates=#{dupes.length} expired_active=#{expired.length} traditional_monuments=#{boring.length}"
abort(errors.join("\n")) unless errors.empty?
puts "VALID"
