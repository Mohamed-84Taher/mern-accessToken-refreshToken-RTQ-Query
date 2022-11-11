import React from 'react'
import { Link } from 'react-router-dom'

const Welcome = () => {
    const date=new Date()
    const today=new Intl.DateTimeFormat('en-US',{dateStyle:'full',timeStyle:'long'}).format(date)
    const content=(
        <div className='welcome'>
   <p>{today}</p>
   <h1>Welcome</h1>
   <p><Link to='/dash/notes'>View techNotes</Link></p>
   <p><Link to='/dash/users'>View Users settings</Link></p>
        </div>
    )
  return content
}

export default Welcome