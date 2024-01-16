import { NextRequest } from 'next/server'
import { JSDOM } from 'jsdom'

export async function GET(request: NextRequest) {
  const words = [
    // 'абстракция',
    // 'алгоритм',
    // 'анализ',
    // 'архитектура',
    // 'асинхронность',
    // 'база данных',
    // 'библиотека',
    // 'браузер',
    // 'ввод',
    // 'вывод',
    // 'функция',
    // 'класс',
    // 'конструктор',
    // 'метод',
    // 'модуль',
    // 'наследование',
    // 'объект',
    // 'операция',
    // 'переменная',
    // 'полиморфизм',
    // 'поток',
    // 'процесс',
    // 'программа',
    // 'рекурсия',
    // 'рефакторинг',
    // 'селектор',
    // 'сервер',
    // 'синтаксис',
    // 'структура',
    // 'суперкласс',
    // 'терминал',
    // 'тип данных',
    // 'фреймворк',
    // 'функционал',
    // 'топор',
    // 'боль',
    // 'вентилятор',
    // 'гром',
    // 'трезубец',
    // 'баскетбол',

    // incomplete

    // 'абстракци',
    // 'алгорит',
    // 'анали',
    // 'архитектур',
    // 'асинхронност',
    // 'база данны',
    // 'библиотек',
    // 'браузе',
    // 'вво',
    // 'выво',
    // 'функци',
    // 'клас',
    // 'конструкто',
    // 'мето',
    // 'модул',
    // 'наследовани',
    // 'объек',
    // 'операци',
    // 'переменна',
    // 'полиморфиз',
    // 'пото',
    // 'процес',
    // 'программ',
    // 'рекурси',
    // 'рефакторин',
    // 'селекто',
    // 'серве',
    // 'синтакси',
    // 'структур',
    // 'суперклас',
    // 'термина',
    // 'тип данны',
    // 'фреймвор',
    // 'функциона',
    // 'топо',
    // 'бол',
    // 'вентилято',
    // 'гро',
    // 'трезубе',
    // 'баскетбо',

    // chinese

    '你', // you
    '我', // I
    '他', // he
    '她', // she
    '这', // this
    '那', // that
    '在', // at
    '有', // have
    '没有', // no
    '是', // is
    '不是', // isn't
    '喜欢', // like
    '不喜欢', // not like
    '好', // good
    '坏', // bad
    '大', // big
    '小', // small
    '高', // tall
    '矮', // short
    '快', // fast
    '慢', // slow
    '飞', // fly
    '跑', // run
    '走', // walk
    '看', // see
    '说', // say
    '听', // hear
    '唱', // sing
    '吃', // eat
    '喝', // drink
    '工作', // work
    '学习', // study
    '玩', // play
    '读', // read
    '写', // write
    '画', // draw
    '数', // count
    '记', // remember
    '想', // think
    '知道', // know
    '不知道', // don't know
    '问', // ask
    '答', // answer
    '开始', // start
    '结束', // end
    '上', // up
    '下', // down
    '左', // left
    '右', // right
    '前', // front
    '后', // behind
    '中', // middle
    '外', // outside
    '里', // inside
    '天空', // sky
    '地球', // earth
    '月亮', // moon
    '太阳', // sun
    '星星', // stars
    '水', // water
    '火', // fire
    '雨', // rain
    '雪', // snow
    '云', // clouds
    '风', // wind
    '花', // flowers
    '草', // grass
    '树', // trees
    '山', // mountains
    '海', // sea
    '河', // river
    '湖', // lake
    '公园', // park
    '城市', // city
    '村庄', // village
    '家', // home
    '学校', // school
    '医院', // hospital
    '商店', // store
    '餐厅', // restaurant
    '电影院', // cinema
    '图书馆', // library
    '博物馆', // museum
    '音乐会', // concert
    '体育赛事', // sports event
    '旅行', // travel
    '游戏', // game
    '运动', // sport
    '美食', // food
    '电视', // TV
    '电脑', // computer
    '手机', // phone
    '相机', // camera
    '车', // car
    '飞机', // airplane
    '船', // ship
    '钱', // money
    '时间', // time
    '日期', // date
    '地点', // location
    '人', // person
    '物', // thing
    '事', // matter
    '情况', // situation
    '方法', // method
    '原因', // reason
    '目的', // purpose
    '方向', // direction
    '路', // road
    '道路', // highway
    '桥', // bridge
    '隧道', // tunnel
    '建筑', // building
    '房子', // house
    '公司', // company
    '政府', // government
    '军队', // army
    '国家', // country
    '世界', // world
  ]

  const wordsRes = await Promise.all(
    words.map((word) =>
      (async () => {
        const res = await fetch(`https://bkrs.info/slovo.php?ch=${word}`)
        const text = await res.text()
        const el = new JSDOM(text).window.document.querySelector('#ajax_search .margin_left #xinsheng_fullsearch')
        return !!el
      })()
    )
  )

  return Response.json({
    total: words.length,
    found: wordsRes.filter((w) => w === true).length,
    notFound: wordsRes.filter((w) => w === false).length,
  })
}
