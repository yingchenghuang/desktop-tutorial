#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'
require 'uri'

ROOT = File.expand_path('..', __dir__)
payload = JSON.parse(File.read(File.join(ROOT, 'data', 'landmark-events.json')))
manifest = JSON.parse(File.read(File.join(ROOT, 'data', 'landmark-event-manifest.json')))
entries = payload.fetch('entries')
required = %w[id dedupeKey name tier region country cityKeywords media comment website classicImage sourceImage exhibitionType organizer venue founded frequency focusAreas importance]
errors = []

errors << "expected at least 20 entries, got #{entries.length}" if entries.length < 20
errors << 'payload must be an object with meta and entries' unless payload['meta'].is_a?(Hash) && payload['entries'].is_a?(Array)
errors << 'manifest total mismatch' unless manifest['totalEntries'] == entries.length
errors << 'duplicate id' unless entries.map { |entry| entry['id'] }.uniq.length == entries.length
errors << 'duplicate dedupeKey' unless entries.map { |entry| entry['dedupeKey'] }.uniq.length == entries.length

entries.each_with_index do |entry, index|
  missing = required.select do |key|
    value = entry[key]
    value.nil? || (value.respond_to?(:empty?) && value.empty?)
  end
  errors << "entry #{index + 1} missing #{missing.join(', ')}" unless missing.empty?
  errors << "entry #{index + 1} wrong tier" unless entry['tier'] == '全球指標藝術節展'
  errors << "entry #{index + 1} is not official" unless entry['status'] == '官方來源'
  %w[website sourceImage curatorStatementSource].each do |key|
    begin
      uri = URI.parse(entry[key].to_s)
      errors << "entry #{index + 1} #{key} is not https" unless uri.is_a?(URI::HTTPS)
    rescue URI::InvalidURIError
      errors << "entry #{index + 1} #{key} is invalid"
    end
  end
  unless entry['classicImage'].to_s.start_with?('https://')
    local_path = File.join(ROOT, entry['classicImage'].to_s)
    errors << "entry #{index + 1} local image missing" unless File.file?(local_path) && File.size(local_path).positive?
  end
end

coverage = entries.flat_map { |entry| entry['focusAreas'] }.uniq
%w[藝術 設計 建築 地景].each do |area|
  errors << "missing required focus area #{area}" unless coverage.include?(area)
end

abort(errors.join("\n")) unless errors.empty?
puts JSON.pretty_generate({
  status: 'ok',
  total: entries.length,
  official: entries.count { |entry| entry['status'] == '官方來源' },
  images: entries.count { |entry| !entry['classicImage'].to_s.empty? },
  focusAreas: coverage.sort,
  countries: entries.map { |entry| entry['country'].split('/').first.strip }.uniq.length
})
