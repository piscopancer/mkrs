import MarkdownArticle from '@/components/markdown'
import Reverso from '@/components/reverso'
import { hotkeys } from '@/hotkeys'
import { project } from '@/project'

export default function InfoPage() {
  return (
    <MarkdownArticle>
      {`
# Баги в браузерах Mozilla Firefox и Safari 

Из-за особенностей движка браузера будьте готовы к визуальным багам, включая некорректное отображение цветов и некорректную разметку. Также есть баги на ****.

В **Яндекс Браузере** и **Google Chrome** сайт работает стабильно.

# Целевая аудитория

Если вы **преподаватель** или **студентик**, то [大БКРС](https://bkrs.info) вы, должно быть, используете для поиска, записи и заучивания слов. Если это так, этот сайт для вас.

Этот сайт я разрабатывал для себя. Все, что вы видите на этом сайте — результат моего больного воображения.

Главный вопрос, который решает МКРС — это более удобное взаимодействие со словарем 大БКРС (подробнее о функционале в [особенностях](#Особенности)). Так если вы ищете работу, хотите побеседовать на форуме или добавить или изменить слово — вам на [大БКРС](https://bkrs.info).

# Особенности

## История просмотров

Недавно просмотренные слова хранятся в памяти вашего устройства и доступны только локально. Нет никакой авторизации или базы данных.

Если углублятся в технические подробности, то слова хранятся в \`localStorage\` вашего браузера. Если вы почистили кэш браузера, то слова удалятся.

## Сохраненные слова

Нажмите на иконку дискеты возле слова, чтобы сохранить его.

## Поддержка горячих клавиш

Можно сфокусироваться на поиске по клавише <kbd>${hotkeys.focus.display}</kbd>. Или переключаться по страницам:
  
${[hotkeys['main-page'], hotkeys['recent-page'], hotkeys['saved-page']].map((info) => `- <kbd>${info.display}</kbd> ${info.name}`).join(';\n') + `.`}

Полную карту раскладки смотрите на соответствующей странице.

## Reverso Context
`}
      <Reverso search='小' mode='ch-en' />
      {`
Дополнительно смотрите переводы с примерами на английском языке от Reverso Context. Иногда одного 大БКРС не хватает и нужно знать перевод не только на русский, но и на английский: кому-то это нужно по работе, кому-то так проще запоминать, другим же просто может стать интересно. Я сам постоянно держу Reverso Context открытым, когда работаю с китайским, потому что английский язык и примеры Reverso Context помогают мне запоминать переводы и понимать, как использовать слова и выражения в речи.

## Аниме девочки

В верхнем левом углу вы видите аниме девочку. Всего их более 20. Они меняются при каждой перезагрузке страницы и выбираются случайным образом.

Если у вас есть еще гифки, то присылайте мне их в [телегу](${project.creator.links.telegram}).

( \*︾▽︾)

# Устройство работы

МКРС выступает в роли промежуточного сервиса между сайтом 大БКРС и вами. МКРС отправляет запросы на 大БКРС и **парсит** информацию. Иначе говоря, устройство работы МКРС напоминает, если бы вы попросили своего друга зачитать вам страницу с 大БКРС вслух, оказав вам посредничество.

# Про 大БКРС

МКРС не претендует на интеллектуальную собственность 大БКРС и не является террористической организацией.

# Благодарности

Хочу сказать большое спасибо:

- **Никите Крылю** за разработку дизайна сайта и финансовую поддержку;
- **Джаримасу Курманову** за поиск багов;
- **Олесе Беспаловой** за помощь в поиске аниме девочек;
- создателям и сообществу 大БКРС.
`}
    </MarkdownArticle>
  )
}
