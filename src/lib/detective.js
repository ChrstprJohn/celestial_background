import { GALAXY_IMAGE, FEATURED_DISCOVERY } from './featured.js'
import { PLANET_FACTS_SOURCE } from './planets.js'

export const DETECTIVE_QUESTIONS = [
  { id:'galaxy', question:'What are you looking at?', options:['A spiral galaxy','A planet','The Moon','A comet'], answer:0, hint:'Look for arms wrapped around a bright central region.', explanation:'This is NGC 1232, a spiral galaxy. Its sweeping arms contain stars, gas, and dust.', image:GALAXY_IMAGE, source:FEATURED_DISCOVERY.source, credit:FEATURED_DISCOVERY.credit },
  { id:'saturn', question:'Which world wears these rings?', options:['Mars','Saturn','Mercury','Venus'], answer:1, hint:'This gas giant is famous for its wide, bright rings.', explanation:'Saturn’s rings are made of countless particles of ice and rock.', planet:'saturn', source:PLANET_FACTS_SOURCE },
  { id:'moon', question:'Which familiar neighbor is this?', options:['The Sun','Jupiter','The Moon','Neptune'], answer:2, hint:'Its changing phases are visible from Earth.', explanation:'Our Moon reflects sunlight. We see different portions of its sunlit half as it travels around Earth.', moon:true, source:'https://science.nasa.gov/moon/' },
  { id:'mars', question:'Which planet is known as the red planet?', options:['Earth','Neptune','Venus','Mars'], answer:3, hint:'Iron minerals give this rocky world its rusty color.', explanation:'Mars gets its red appearance from oxidized iron minerals in its soil.', planet:'mars', source:'https://science.nasa.gov/mars/facts/' },
  { id:'earth', question:'Which world is our home?', options:['Earth','Uranus','Mercury','Saturn'], answer:0, hint:'Look for oceans and familiar continents.', explanation:'Earth is our ocean-covered home and the only world where we have found life.', planet:'earth', source:'https://science.nasa.gov/earth/facts/' },
]

export function shuffledQuestions(random = Math.random) {
  const questions = [...DETECTIVE_QUESTIONS]
  for (let index = questions.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1))
    ;[questions[index],questions[target]] = [questions[target],questions[index]]
  }
  return questions
}
