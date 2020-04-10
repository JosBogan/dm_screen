import React from 'react'

class Sheet extends React.Component {

  render() {
    console.log(this.props.borderIndex)
    return (
      <div 
        className="sheet_container"
        name="sheet"
        id={this.props.id}
        style={{
          height: '100px',
          width: '160px',
          top: `${this.props.coords.y}px`,
          left: `${this.props.coords.x}px`,
          opacity: this.props.sheetHovering && this.props.id === this.props.sheetClicked ? '0.5' : '1',
          [this.props.borderIndex]: '4px solid blue'
        }}
      >
        <div className="sheet_connector_container">
          <div className="sheet_connector"></div>
          <div className="sheet_container_central_container">
            <div className="sheet_connector"></div>
            <div className="sheet_connector"></div>
          </div>
          <div className="sheet_connector"></div>
        </div>
      </div>
    )
  }
}

export default Sheet