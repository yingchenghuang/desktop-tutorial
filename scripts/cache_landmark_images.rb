#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'
require 'json'
require 'open3'
require 'uri'

ROOT = File.expand_path('..', __dir__)
DATA_FILE = File.join(ROOT, 'data', 'landmark-events.json')
OUTPUT_DIR = File.join(ROOT, 'assets', 'landmark-events')
FileUtils.mkdir_p(OUTPUT_DIR)

entries = JSON.parse(File.read(DATA_FILE)).fetch('entries')
failures = []

entries.each_with_index do |entry, index|
  source = entry.fetch('sourceImage')
  extension = File.extname(URI.parse(source).path).downcase
  extension = '.jpg' if extension == '.jpeg' || extension.empty?
  slug = entry.fetch('id').sub(/\Alandmark-event-/, '')
  destination = File.join(OUTPUT_DIR, "#{slug}#{extension}")
  temporary = "#{destination}.part"
  FileUtils.rm_f(temporary)

  command = [
    'curl', '--http1.1', '-L', '--fail', '--retry', '3', '--retry-all-errors',
    '--connect-timeout', '20', '--max-time', '120', '-A', 'Mozilla/5.0',
    '-e', entry.fetch('website'), '-sS', source, '-o', temporary
  ]
  _stdout, stderr, status = Open3.capture3(*command)
  if status.success? && File.file?(temporary) && File.size(temporary).positive?
    FileUtils.mv(temporary, destination)
    warn format('%02d/%02d cached %s (%d bytes)', index + 1, entries.length, File.basename(destination), File.size(destination))
  else
    failures << { id: entry['id'], source: source, error: stderr.strip }
    FileUtils.rm_f(temporary)
  end
end

unless failures.empty?
  warn JSON.pretty_generate(failures)
  abort "failed to cache #{failures.length} images"
end

puts JSON.generate({ status: 'ok', cached: entries.length, directory: OUTPUT_DIR })

