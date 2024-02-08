const ATTACK_VALUE = 10
const MONSTER_ATTACK_VALUE = 14
const STRONG_ATTACK_VALUE = 17
const HEAL_VALUE = 20

const MODE_ATTACK = 'ATTACK'
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'

const LOG_EVENT_PLAYER_ATTACK = 'PLAYAR_ATTACK'
const LOG_EVENT_PLAYER_STORG_ATTACK = 'PLAYAR_STRONG_ATTACK'
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK'
const LOG_EVENT_PLAYR_HEAL = 'PLAYER-HEAL'
const LOG_EVENT_GAME_OVER = 'GAME_OVER'

function writetolog (ev, val, monsterHealth, playerhealth) {
  let logEntry

  if (ev === LOG_EVENT_PLAYER_ATTACK) {
    logEntry = {
      event: ev,
      value: val,
      target: 'MONSTER',
      finalMonsterHealth: monsterHealth,
      finalplayerHealth: playerhealth
    }
  } else if (ev === LOG_EVENT_PLAYER_STORG_ATTACK) {
    logEntry = {
      event: ev,
      value: val,
      target: 'MONSTER',
      finalMonsterHealth: monsterHealth,
      finalplayerHealth: playerhealth
    }
  } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    logEntry = {
      event: ev,
      value: val,
      target: 'PLAYER',
      finalMonsterHealth: monsterHealth,
      finalplayerHealth: playerhealth
    }
  } else if (ev === LOG_EVENT_PLAYR_HEAL) {
    logEntry = {
      event: ev,
      value: val,
      target: 'PLAYER',
      finalMonsterHealth: monsterHealth,
      finalplayerHealth: playerhealth
    }
  } else if (ev === LOG_EVENT_GAME_OVER) {
    logEntry = {
      event: ev,
      value: val,
      finalMonsterHealth: monsterHealth,
      finalplayerHealth: playerhealth
    }
  }
  battleLog.push(logEntry)
}

let battleLog = []

function getmaxlifevalue () {
  const enterdvalue = prompt('Maximum life for you and the monster .', '100')
  let parsevalue = parseInt(enterdvalue)
  if (isNaN(parsevalue) || parsevalue <= 0) {
    throw { message: 'invalid user input ' }
  }
  return parsevalue
}
let chosemaxlife

try {
  chosemaxlife = getmaxlifevalue()
} catch (error) {
  console.log(error)
  chosemaxlife = 100
  throw error;
}

let currentmonsterhealth = chosemaxlife
let currentplayerhealth = chosemaxlife
let bonuslife = true

adjustHealthBars(chosemaxlife)

function reset () {
  currentmonsterhealth = chosemaxlife
  currentplayerhealth = chosemaxlife
  resetGame(chosemaxlife)
}

function endround () {
  let initalplayerhelth = currentplayerhealth
  const playerdamage = dealPlayerDamage(MONSTER_ATTACK_VALUE)
  currentplayerhealth -= playerdamage

  writetolog(
    LOG_EVENT_MONSTER_ATTACK,
    playerdamage,
    currentmonsterhealth,
    currentplayerhealth
  )

  if (currentplayerhealth <= 0 && bonuslife) {
    bonuslife = false
    removeBonusLife()
    currentplayerhealth = initalplayerhelth
    setPlayerHealth(initalplayerhelth)
    alert('you would be dead but the bouns life saved you ')
  }

  if (currentmonsterhealth <= 0 && currentplayerhealth > 0) {
    alert('you won')
    writetolog(
      LOG_EVENT_GAME_OVER,
      'PLAYER WON',
      currentmonsterhealth,
      currentplayerhealth
    )
  } else if (currentplayerhealth <= 0 && currentmonsterhealth > 0) {
    alert('you lose')
    writetolog(
      LOG_EVENT_GAME_OVER,
      'MONSTER WON',
      currentmonsterhealth,
      currentplayerhealth
    )
  } else if (currentplayerhealth <= 0 && currentmonsterhealth <= 0) {
    alert('you have a draw')
    writetolog(
      LOG_EVENT_GAME_OVER,
      'A DRAW ',
      currentmonsterhealth,
      currentplayerhealth
    )
  }

  if (currentmonsterhealth <= 0 || currentplayerhealth <= 0) {
    reset()
  }
}

function attackMonster (mode) {
  let maxdamge
  let logevent

  if (mode === MODE_ATTACK) {
    maxdamge = ATTACK_VALUE
    logevent = LOG_EVENT_PLAYER_ATTACK
  } else if (mode === MODE_STRONG_ATTACK) {
    maxdamge = STRONG_ATTACK_VALUE
    logevent = LOG_EVENT_PLAYER_STORG_ATTACK
  }

  const damge = dealMonsterDamage(maxdamge)
  currentmonsterhealth -= damge
  writetolog(logevent, damge, currentmonsterhealth, currentplayerhealth)
  endround()
}

function attackHandler () {
  attackMonster(MODE_ATTACK)
}

function strongattackhadler () {
  attackMonster(MODE_STRONG_ATTACK)
}

function healplayer () {
  let healvalue
  if (currentplayerhealth >= chosemaxlife - HEAL_VALUE) {
    alert('You cant heal to more than your max inital health  ')
    healvalue = chosemaxlife - currentplayerhealth
  } else {
    healvalue = HEAL_VALUE
  }
  increasePlayerHealth(healvalue)
  currentplayerhealth += healvalue
  writetolog(
    LOG_EVENT_PLAYR_HEAL,
    healvalue,
    currentmonsterhealth,
    currentplayerhealth
  )
  endround()
}

function printLogHandler () {
  // for(let i=0; i<battleLog.length;i++){
  //     console.log(battleLog[i])
  // }

  let i = 0
  for (const log of battleLog) {
    console.log(`#${i}`)

    for (const key in log) {
      console.log(`${key}=>${log[key]}`)
    }
  }
}

let uu=0;
do{

    console.log(uu);
    uu++;

}while(false);


attackBtn.addEventListener('click', attackHandler)
strongAttackBtn.addEventListener('click', strongattackhadler)
healBtn.addEventListener('click', healplayer)
logBtn.addEventListener('click', printLogHandler)
