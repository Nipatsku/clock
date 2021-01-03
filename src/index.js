import "./style.css"
const moment = require('moment')
const { knownFonts, coolFonts } = require('./fonts')


const container = document.getElementsByClassName('container')[0]


// #region Utils

/**
 * @param i     [0,1]
 */
const getDigit = ( timeValue, i ) => {
    i = Math.min(i, 1)
    let str = String(timeValue)
    if ( str.length === 1 ) str = '0' + str
    return str[i]
}

/**
 * @param {[0, 5, 3, 10, 1]} numbers 
 * @return  10 | 5 | false
 */
const getDividable = ( numbers ) => {
    const sum = numbers.reduce((prev, cur) => prev + Number(cur), 0)
    return sum % 10 === 0 ?
        10 :
        sum % 5 === 0 ?
            5 :
            false
}

const rand = (arrayOrMin, max) => {
    if ( Array.isArray(arrayOrMin) ) {
        return Math.round(Math.random() * (arrayOrMin.length - 1))
    }
    return Math.round(arrayOrMin + Math.random() * (max - arrayOrMin))
} 

const overrideFunc = (prev, add) => {
    return (args) => {
        prev(args)
        add(args)
    }
}

// #endregion


const Clock = (opts) => {
    opts = Object.assign({
        type: 'second-clock',
        position: 'centered',
        size: 'full',
        font: 'irregular'
    },opts)

    const div = document.createElement('div')
    container.appendChild(div)
    div.className = 'time-div'

    let updateFunc = () => undefined
    if ( opts.type === 'second-clock' ) {
        const digitElements = []
        for ( let i = 0; i < 6; i ++ ) {
            const span = document.createElement('span')
            div.appendChild(span)
            span.className = 'time-digit'
            digitElements.push(span)
            if ( i === 1 || i == 3 ) {
                const space = document.createElement('span')
                div.appendChild(space)
                space.className = 'time-space'
                space.innerHTML = ':'
            }
        }
        updateFunc = overrideFunc(updateFunc, () => {
            const now = new Date()
            const digits = [
                getDigit( now.getHours(), 0 ),
                getDigit( now.getHours(), 1 ),
                getDigit( now.getMinutes(), 0 ),
                getDigit( now.getMinutes(), 1 ),
                getDigit( now.getSeconds(), 0 ),
                getDigit( now.getSeconds(), 1 ),
            ]
            for ( let i = 0; i < 6; i ++ ) {
                const digit = digits[i]
                const span = digitElements[i]
                span.innerHTML = digit
            }

            const dividable = getDividable(digits)
            div.className = div.className.replace( /\s?dividable-(10|5|false)/, '' )
            div.className += ` dividable-${dividable}`
        })
    }

    if ( opts.position === 'centered' ) {
        div.className += ' position-centered'
    }

    if ( opts.size === 'full' ) {
        div.className += ' size-full'
    }

    if ( opts.font === 'random' ) {
        div.style.fontFamily = coolFonts[rand(coolFonts)]
    } else if ( opts.font === 'irregular' ) {
        let iFont
        updateFunc = overrideFunc(updateFunc, (iCycle) => {
            if ( new Date().getSeconds() !== 0 && iFont ) return
            let nextIndex
            for ( let attempt = 0; attempt <= 50; attempt ++ ) {
                nextIndex = rand(coolFonts)
                if ( nextIndex !== iFont ) break
            }
            iFont = nextIndex
            div.style.fontFamily = coolFonts[iFont]
        })
    }

    let lastUpdateDate
    let iCycle = 0
    const cycle = () => {
        const now = new Date()
        if ( !lastUpdateDate || now.getSeconds() !== lastUpdateDate.getSeconds() ) {
            updateFunc(iCycle++)
            lastUpdateDate = now
        }
        requestAnimationFrame(cycle)
    }
    cycle()

}
Clock({})

