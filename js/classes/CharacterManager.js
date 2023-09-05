class Character {
  constructor(name = '', st = 0, dx = 0, iq = 0, ht = 0) {
    this.name = name

    //Primary
    this.st = st
    this.dx = dx
    this.iq = iq
    this.ht = ht

    //Secondary
    this.atk = Math.floor(2 * this.st + this.dx + this.iq / 2)
    this.def = Math.floor(2 * this.iq + this.dx + this.ht / 2)
    this.esq = Math.floor(2 * this.dx + this.iq + this.st / 2)
    this.end = Math.floor(2 * this.ht + this.st + this.dx / 2)

    this.hpLeft = this.end

    this.body = {
      'HEAD': 0,
      'NECK': 0,
      'TORSO': 0,
      'LEGS': 0,
      'FOOT': 0,
      'LHAND': 0,
      'RHAND': 0
    }
  }

  modSpecs(type, value = 0) {
    switch (type) {
      case 'st':
        this.st = value
        this.modSpecs('atk', Math.floor(2 * this.st + this.dx + this.iq / 2))
        this.modSpecs('esq', Math.floor(2 * this.dx + this.iq + this.st / 2))
        this.modSpecs('end', Math.floor(2 * this.ht + this.st + this.dx / 2))
        break
      case 'dx':
        this.dx = value
        this.modSpecs('atk', Math.floor(2 * this.st + this.dx + this.iq / 2))
        this.modSpecs('def', Math.floor(2 * this.iq + this.dx + this.ht / 2))
        this.modSpecs('esq', Math.floor(2 * this.dx + this.iq + this.st / 2))
        this.modSpecs('end', Math.floor(2 * this.ht + this.st + this.dx / 2))
        break
      case 'iq':
        this.iq = value
        this.modSpecs('atk', Math.floor(2 * this.st + this.dx + this.iq / 2))
        this.modSpecs('def', Math.floor(2 * this.iq + this.dx + this.ht / 2))
        this.modSpecs('esq', Math.floor(2 * this.dx + this.iq + this.st / 2))
        break
      case 'ht':
        this.ht = value
        this.modSpecs('def', Math.floor(2 * this.iq + this.dx + this.ht / 2))
        this.modSpecs('end', Math.floor(2 * this.ht + this.st + this.dx / 2))
        break
      case 'atk':
        this.atk = value
        break
      case 'def':
        this.def = value
        break
      case 'esq':
        this.esq = value
        break
      case 'end':
        const oldEnd = this.end
        this.end = value
        this.hpLeft = (this.hpLeft === oldEnd) ? this.end : this.hpLeft + (this.end - oldEnd)
        break
    }    
  }

  calcStat(zone = 'LHAND', equipe) {
    if (equipe === 'undefined') {
      return
    }
    else if (equipe) {
      this.modSpecs('st', this.st + this.body[zone].st)
      this.modSpecs('dx', this.dx + this.body[zone].dx)
      this.modSpecs('iq', this.iq + this.body[zone].iq)
      this.modSpecs('ht', this.ht + this.body[zone].ht)
    }
    else {
      this.modSpecs('st', this.st - this.body[zone].st)
      this.modSpecs('dx', this.dx - this.body[zone].dx)
      this.modSpecs('iq', this.iq - this.body[zone].iq)
      this.modSpecs('ht', this.ht - this.body[zone].ht)
    }
  }
}

class Hero extends Character {
  constructor(x = 0, y = 0, name = '', st = 0, dx = 0, iq = 0, ht = 0) {
    super(name, st, dx, iq, ht)
    this.x = x
    this.y = y
    this.vision = 2
    this.inventory = new Array(10)
  }

  heal() {
    if (this.hpLeft < this.end) {
      this.hpLeft++
      return true
    }
    return false
  }
}

class Monster extends Character {
  constructor(name, st, dx, iq, ht, aggressive) {
    super(name, st, dx, iq, ht)
    this.aggressive = aggressive
  }

  compareWeapons() {

  }
}

export { Monster, Hero };