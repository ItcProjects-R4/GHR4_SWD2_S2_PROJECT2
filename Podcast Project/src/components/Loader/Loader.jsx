import React from 'react'
import LoadingSpinner from '../Common/LoadingSpinner/LoadingSpinner'

export default function Loader({ fullScreen = true, message = 'Loading...' }) {
  if (fullScreen) {
    return <LoadingSpinner fullScreen message={message} />
  }

  return <LoadingSpinner message={message} />
}
