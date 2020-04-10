import React from 'react'

import Sheet from './Sheet'

class Screen extends React.Component {

  state = {
    boardClicked: false,
    startingPos: {
      x: null,
      y: null
    },
    screenPos: {
      x: 0,
      y: 0
    },
    sheetClicked: null,
    sheetHovering: false,
    boundries: [],
    borderIndex: [],
    sheets: [
      {
        name: 'falling',
        x: 0,
        y: 0
      },
      {
        name: 'size',
        x: 0,
        y: 0
      },
      {
        name: 'uba',
        x: 0,
        y: 0
      }
    ]
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('mousemove', this.onMouseMove)
  }

  onMouseMove = (event) => {
    if (!this.state.boardClicked && !this.state.sheetClicked) return
    //  Move the Board
    if (this.state.boardClicked) {
      const mouseDiff = {
        x: event.clientX - this.state.startingPos.x,
        y: event.clientY - this.state.startingPos.y
      }
      const screenPos = {
        x: this.state.screenPos.x + mouseDiff.x,
        y: this.state.screenPos.y + mouseDiff.y
      }
      const startingPos = {
        x: event.clientX,
        y: event.clientY
      }
      this.setState({ screenPos, startingPos })
    } else if (this.state.sheetClicked) {
      // Move the Sheet
      const sheets = JSON.parse(JSON.stringify(this.state.sheets))
      const sheet = sheets.find(sheet => sheet.name === this.state.sheetClicked)
      const mouseDiff = {
        x: event.clientX - this.state.startingPos.x,
        y: event.clientY - this.state.startingPos.y
      }
      const sheetPos = {
        x: sheet.x + mouseDiff.x,
        y: sheet.y + mouseDiff.y
      }
      const startingPos = {
        x: event.clientX,
        y: event.clientY
      }

      sheet.x = sheetPos.x
      sheet.y = sheetPos.y

      for (let i = 0; i < this.state.boundries.length; i++) {
        const sheet = this.state.boundries[i]
        if ((
          (event.clientY > (sheet.top) - 10 && event.clientY < (sheet.top) + 10)) &&
          (event.clientX > sheet.left && event.clientX < sheet.right)
        ) {
          this.setState({ borderIndex: [sheet.name, 'borderTop'], sheetHovering: true })
          break
        } else if (
          (event.clientY > (sheet.bottom) - 10 && event.clientY < (sheet.bottom) + 10) &&
          (event.clientX > sheet.left && event.clientX < sheet.right)
          ) {
          this.setState({ borderIndex: [sheet.name, 'borderBottom'], sheetHovering: true })
          break
        } else if (
          (event.clientX > (sheet.right) - 10 && event.clientX < (sheet.right) + 10) &&
          (event.clientY > sheet.top && event.clientY < sheet.bottom)
          ) {
          this.setState({ borderIndex: [sheet.name, 'borderRight'], sheetHovering: true })
          break
        } else if (
          (event.clientX > (sheet.left) - 10 && event.clientX < (sheet.left) + 10) &&
          (event.clientY > sheet.top && event.clientY < sheet.bottom)
          ) {
          this.setState({ borderIndex: [sheet.name, 'borderLeft'], sheetHovering: true })
          break
        } else {
          this.setState({ borderIndex: [], sheetHovering: false })
        }
      }

      this.setState({ sheets, startingPos })
    }
  }

  onMouseDown = (event) => {
    event.stopPropagation()
    const startingPos = {
      x: event.clientX,
      y: event.clientY
    }
    if (event.target.getAttribute('name') === 'screen') {
      this.setState({ boardClicked: true, startingPos })
    } else if (event.target.getAttribute('name') === 'sheet') {

      const sheets = document.querySelectorAll('.sheet_container')

      let filteredSheets = Array.from(sheets).filter(sheet => sheet !== event.target)
      const screenDimensions = document.querySelector('.screen').getBoundingClientRect()

      const boundries = filteredSheets.map(sheet => {
        const dimensions = sheet.getBoundingClientRect()
        return {
          name: sheet.getAttribute('id'),
          top: dimensions.top,
          right: dimensions.right,
          bottom: dimensions.bottom,
          left: dimensions.left
        }
      })

      this.setState({ 
        sheetClicked: event.target.getAttribute('id'), 
        startingPos,
        boundries
      })
    }
  }

  onMouseUp = (event) => {
    const sheets = JSON.parse(JSON.stringify(this.state.sheets))
    const board = document.querySelector('.screen').getBoundingClientRect()
    const sheetElements = Array.from(document.querySelectorAll('.sheet_container'))
    const heldElement = sheetElements.find(sheet => sheet.getAttribute('id'))
    const hoveredElement = sheetElements.find(sheet => sheet.getAttribute('id'))
    const sheet = sheets.find(sheet => sheet.name === this.state.sheetClicked)
    const hoveredOver = sheets.find(sheet => sheet.name === this.state.borderIndex[0])

    console.log(event.target.offsetHeight, board.height)

    if (parseInt(event.target.style.top) < 0) {
      sheet.y = 0
    }
    if (parseInt(event.target.style.left) < 0) {
      sheet.x = 0
    }
    if (parseInt(event.target.style.top) > (board.height - event.target.offsetHeight)) {
      sheet.y = board.height - event.target.offsetHeight
    }
    if (parseInt(event.target.style.left) > (board.width - event.target.offsetWidth)) {
      sheet.x = board.width - event.target.offsetWidth
    }

    if (this.state.borderIndex.length === 2) {
      switch (this.state.borderIndex[1]) {
        case 'borderTop':
          sheet.y = hoveredOver.y - heldElement.getBoundingClientRect().height
          break
        case 'borderRight':
          sheet.x = hoveredOver.x + hoveredElement.getBoundingClientRect().width
          break
        case 'borderBottom':
          sheet.y = hoveredOver.y + hoveredElement.getBoundingClientRect().height
          break
        case 'borderLeft':
          sheet.x = hoveredOver.x - heldElement.getBoundingClientRect().width
          break
        default:
      }
    }
    
    this.setState({ boardClicked: false, sheetClicked: null, sheets, borderIndex: [] })
  }
  

  render() {
    // console.log(this.state.sheetBoundriesTop)
    return (
      <div 
        className="screen"
        name="screen"
        style={{
          transform: `translate(${this.state.screenPos.x}px, ${this.state.screenPos.y}px)`
        }}
        onMouseDown={this.onMouseDown}
      >
        {this.state.sheets.map(sheet => (
        <Sheet 
          id={sheet.name}
          key={sheet.name}
          coords={sheet}
          sheetClicked={this.state.sheetClicked}
          sheetHovering={this.state.sheetHovering}
          borderIndex={sheet.name === this.state.borderIndex[0] ? this.state.borderIndex[1] : null}
          onMouseDown={this.onMouseDown}/>
        ))}
      </div>
    )
  }
}

export default Screen