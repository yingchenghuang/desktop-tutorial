# encoding: UTF-8
require "json"
require "date"

root=File.expand_path("..",__dir__)
data=File.join(root,"data")
dates=%w[2026-09-04 2026-09-05]
errors=[]

dates.each do |date|
  day=JSON.parse(File.read(File.join(data,"backfill-september-#{date.delete('-')}.json")))
  entries=day.fetch("entries")
  counts={
    total:entries.length,
    dynamic:entries.count{|e|e["id"].start_with?("current")},
    global:entries.count{|e|e["id"].start_with?("classic-global")},
    german:entries.count{|e|e["id"].start_with?("classic-german")}
  }
  errors << "#{date} counts #{counts}" unless counts=={total:20,dynamic:10,global:5,german:5}
  errors << "#{date} public art missing fields" if entries.any?{|e|%w[id dedupeKey name cityKeywords media website photo artistStatement artistStatementSource].any?{|k|e[k].nil?||(e[k].respond_to?(:empty?)&&e[k].empty?)}}
  puts "#{date} public art #{counts}"
end

comp=JSON.parse(File.read(File.join(data,"competitions.json")))
ex=JSON.parse(File.read(File.join(data,"exhibitions.json")))
dates.each do |date|
  calls=comp["entries"].select{|e|e["updated"]==date}
  shows=ex["entries"].select{|e|e["updated"]==date}
  errors << "#{date} calls #{calls.length}" unless calls.length==5
  errors << "#{date} exhibitions #{shows.length}" unless shows.length==5
  errors << "#{date} call missing fields" if calls.any?{|e|%w[id dedupeKey name cityKeywords media website photo deadline deadlineTimezone organizer eligibility budget applicationFee].any?{|k|e[k].nil?||(e[k].respond_to?(:empty?)&&e[k].empty?)}}
  errors << "#{date} exhibition missing fields" if shows.any?{|e|%w[id dedupeKey name cityKeywords media website photo exhibitionType exhibitionStatus startDate endDate edition organizer curator venue admission curatorStatement curatorStatementSource].any?{|k|e[k].nil?||(e[k].respond_to?(:empty?)&&e[k].empty?)}}
  puts "#{date} calls=#{calls.length} germany=#{calls.count{|e|e['country'].start_with?('德國')}} exhibitions=#{shows.length}"
end

art_files=Dir[File.join(data,"backfill-{july,august,september}-*.json")].reject{|p|p.end_with?("manifest.json")}
arts=art_files.flat_map{|p|v=JSON.parse(File.read(p));v.is_a?(Hash) ? v.fetch("entries",[]) : v}
all=arts+comp["entries"]+ex["entries"]
dupes=all.group_by{|e|e["dedupeKey"]}.select{|k,v|k&&!k.empty?&&v.length>1}
errors << "duplicate dedupe keys #{dupes.keys.join(', ')}" unless dupes.empty?
expired=comp["entries"].select{|e|e["deadline"]&&DateTime.parse(e["deadline"])<=DateTime.parse("2026-09-05T01:30:00+08:00")}
errors << "expired active calls #{expired.map{|e|e['id']}.join(', ')}" unless expired.empty?
puts "archive totals art=#{arts.length} calls=#{comp['entries'].length} exhibitions=#{ex['entries'].length} duplicates=#{dupes.length} expired_active=#{expired.length}"

abort(errors.join("\n")) unless errors.empty?
puts "VALID"
