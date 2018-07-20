import React from 'react';
import Avatar from './Avatar';
import axios from 'axios';
import styled from 'styled-components';

class App extends React.Component {
  state = { loaded: false, characters: [], left: null, right: null, winner: null }

  componentDidMount() {
    axios.get('https://api.got.show/api/characters/locations')
      .then( res => { 
        let [left, right, ...characters] = res.data
        this.setState({ characters, left, right, loaded: true }) 
      })
  }

  sample = (arr) => {
    const index = Math.floor(Math.random() * arr.length)
    const character = arr[index];
    return character;
  }

  selectCharacters = () => {
    const left = this.sample(this.state.characters);
    let remaining = this.state.characters.filter( s => s.name !== left.name )
    const right = this.sample(remaining);
    let characters = this.state.characters.filter( s => s.name !== left.name && s.name !== right.name )
    this.setState({ left, right, characters });
  }

  winner = (position) => {
    let fighter = this.state[position]
    if (this.state.characters.length === 0) {
      this.setState({ left: fighter, right: fighter });
    } else {
      this.setState({ characters: [...this.state.characters, fighter], winner: fighter.name }, () => {
        if (this.state.characters.length > 1) 
          this.selectCharacters();
      });
    }
  }

  render() {
    let { characters, loaded, left, right, winner } = this.state;
    let fightClass = loaded ? "left fight-box" : "";
    let renderAvatar = false;

    if ( left && right )
      renderAvatar = true

    return (
      <div>
        <h1 textAlign='center'>Game of Thrones</h1>
        <LoadingZone float="left">
          { !loaded && <label>Load Characters</label> }
          <ul id="students">
            { characters.map( (character, i) => <li key={i}>{character.name}</li> )}
          </ul>
        </LoadingZone>
        <FightBox >
        <FightZone >
          <Left className={fightClass} onClick={() => this.winner('left')}>
            { renderAvatar && <Avatar {...left} /> }
          </Left>
          <div id="right" className={fightClass} onClick={() => this.winner('right')}>
            { renderAvatar && <Avatar {...right} /> }
          </div>
        </FightZone>
        </FightBox>
        <Winner color="green" textAlign="center">{ winner ? `Winner: ${winner}` : ''}</Winner>
      </div>
    )
  }
}

const Left = styled.div`
    display: flex;
    justify-content: center;
`

const Winner = styled.div`
  margin-left: auto;
  margin-right: auto;
`


// .avatar {
//   border-radius: 100%;
//   width: 150px;
//   height: 150px;
// }

const FightBox = styled.div` 
   display: flex;
   justify-content: center;
   align-content: flex-start;
  width: 300px;
  height: 300px;
  background-color: #98FB98;
  border: solid 1px red;
  cursor: pointer;
 

`

const FightZone = styled.div` 
  margin-left: 14%;
`

const LoadingZone = styled.div`
	border: solid 1px black;
	min-height: 100px;
	width: 300px;
	cursor: pointer;
`

export default App;