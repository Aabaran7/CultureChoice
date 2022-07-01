/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import specific icons */
import { faA, faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { faBook } from '@fortawesome/free-solid-svg-icons'
import { faArrowsTurnToDots } from '@fortawesome/free-solid-svg-icons'
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { faExplosion } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { faRainbow } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret, faGear, faBook, faArrowsTurnToDots, faArrowRotateLeft)
library.add(faExplosion, faArrowRight, faSquareCheck, faDatabase, faRainbow)
