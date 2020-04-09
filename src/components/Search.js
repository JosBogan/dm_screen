import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

class Search extends React.Component {

  state = {
    open: false
  }

  onClick = () => {
    console.log('clicked')
    this.setState({ open: !this.state.open })
  }

  render() {
    return (
      <div className="search_container">
        <div 
          className="search"
          onClick={this.onClick}
          style={{
            transform: this.state.open ? 'rotate(365deg)' : ''
          }}
        >
          <FontAwesomeIcon className="search_icon" icon={faSearch} />
        </div>
        <div 
          className="search_value"
          style={{
            width: this.state.open ? '200px' : '0px'
          }}
        >
          <input 
            className="search_input"
          />
        </div>
      </div>
    )
  }
}
export default Search