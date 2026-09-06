#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'

ROOT = File.expand_path('..', __dir__)
entries = JSON.parse(File.read(File.join(ROOT, 'data', 'landmark-events.json'))).fetch('entries')
PUBLIC_ROOT = 'https://yingchenghuang.github.io/desktop-tutorial/'

def public_image(value)
  value.to_s.start_with?('https://') ? value : PUBLIC_ROOT + value.to_s.sub(%r{\A/+}, '')
end

def notion_media(values)
  allowed = ['地景/大地藝術', '雕塑', '裝置', '建築/場域', '光/影像/投影', '社會參與',
             '壁畫/街頭', '聲音/霧/水', '數位/互動', '紀念性公共藝術', '平台/策展']
  result = values & allowed
  result.empty? ? ['平台/策展'] : result
end

def page(entry)
  image = public_image(entry['classicImage'] || entry['photo'])
  content = [
    "![#{entry['name']}｜官方圖片](#{image})",
    '',
    '<callout icon="🌐" color="blue_bg">',
    "\t#{entry['importance']}",
    '</callout>',
    '',
    '## 節展定位',
    '',
    "- **類型：** #{entry['exhibitionType']}",
    "- **創辦年份：** #{entry['founded']}",
    "- **舉辦頻率：** #{entry['frequency']}",
    "- **主辦單位：** #{entry['organizer']}",
    "- **主要場地：** #{entry['venue']}",
    "- **涵蓋領域：** #{entry['focusAreas'].join('、')}",
    "- **城市關鍵字：** #{entry['cityKeywords'].join('、')}",
    '',
    '## 策展脈絡',
    '',
    entry['comment'],
    '',
    '## 官方來源',
    '',
    "- [節展官方頁面](#{entry['website']})",
    "- [第一方圖片來源](#{entry['sourceImage']})"
  ].join("\n")

  properties = {
    '名稱' => entry['name'],
    '類別' => entry['category'],
    '來源狀態' => '官方來源',
    '層級' => entry['tier'],
    '地區' => entry['region'],
    '國家地區' => entry['country'],
    '城市關鍵字' => entry['cityKeywords'].join('、'),
    '媒介類型' => notion_media(entry['media']),
    '代表作' => entry['works'],
    '重點短評' => entry['comment'],
    '官網連結' => entry['website'],
    '圖片/作品頁' => entry['workPage'],
    '個人照片' => image,
    '創作者創作論述' => entry['comment'],
    '創作論述來源' => entry['curatorStatementSource'],
    '去重Key' => entry['dedupeKey'],
    '同城關聯' => entry['cityKeywords'].join('、'),
    '經典作品名稱' => entry['classicTitle'],
    '經典作品圖' => image,
    '經典作品詳介' => entry['importance'],
    '主辦單位' => entry['organizer'],
    '展覽類型' => entry['exhibitionType'],
    '展覽狀態' => entry['exhibitionStatus'],
    '屆次' => "創辦 #{entry['founded']}｜#{entry['frequency']}",
    '策展人' => entry['curator'],
    '展覽場地' => entry['venue'],
    '入場資訊' => entry['admission'],
    '策展論述' => entry['curatorStatement'],
    '策展論述來源' => entry['curatorStatementSource'],
    'date:資訊更新日期:start' => entry['updated'],
    'date:資訊更新日期:is_datetime' => 0
  }

  { 'properties' => properties, 'content' => content, 'icon' => '🌐', 'cover' => 'none' }
end

pages = entries.map { |entry| page(entry) }
if ARGV.first == 'count'
  puts JSON.generate({ 'pages' => pages.length, 'withImages' => pages.count { |item| item['content'].start_with?('![') } })
else
  start = ARGV.fetch(0, '0').to_i
  count = ARGV.fetch(1, pages.length.to_s).to_i
  puts JSON.generate({
    'parent' => { 'data_source_id' => '18356b95-d3f2-4d4a-a4da-8dabcd6c7056' },
    'pages' => pages.slice(start, count) || []
  })
end
