import React from 'react'
import NewHeader from '../components/NewHeader'
import ExperienceSection from '../components/ExperienceSection'

const Experience = ({user,onLogOut}) => {
  return (
    <>
     <NewHeader user={user} onLogOut={onLogOut}/>
     <ExperienceSection/>
    </>
  )
}

export default Experience
