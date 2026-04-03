import React from 'react'
import NewHeader from '../components/NewHeader'
import EventsSection from '../components/EventsSection';
import WhyChooseHelloViza from '../components/WhyChooseHelloViza';

const Events = ({ user, onLogout }) => {
  return (
    <>
    <NewHeader user={user} onLogout={onLogout}/>
    <EventsSection/>
    </>
  )
}

export default Events;
