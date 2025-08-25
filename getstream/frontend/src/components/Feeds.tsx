import React, { useState, useEffect } from 'react'
import { useStream } from '../contexts/StreamContext'

interface Activity {
  id: string
  actor: string
  verb: string
  object: string
  message?: string
  time: string
}

const Feeds: React.FC = () => {
  const { streamClient, currentUser, isAuthenticated } = useStream()
  const [activities, setActivities] = useState<Activity[]>([])
  const [newActivity, setNewActivity] = useState({ verb: 'post', object: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadFeed()
    }
  }, [isAuthenticated, currentUser])

  const loadFeed = async () => {
    if (!streamClient || !currentUser) return

    try {
      setIsLoading(true)
      const userFeed = streamClient.feed('user', currentUser.id)
      const response = await userFeed.get({ limit: 20 })
      setActivities(response.results || [])
    } catch (error) {
      console.error('Error loading feed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!streamClient || !currentUser || !newActivity.object.trim()) return

    try {
      const userFeed = streamClient.feed('user', currentUser.id)
      const activity = {
        actor: `user:${currentUser.id}`,
        verb: newActivity.verb,
        object: newActivity.object,
        message: newActivity.message
      }

      await userFeed.addActivity(activity)
      setNewActivity({ verb: 'post', object: '', message: '' })
      loadFeed()
    } catch (error) {
      console.error('Error adding activity:', error)
      alert('Failed to add activity. Please check your Stream configuration.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="feeds">
        <h1>Activity Feeds</h1>
        <p>Please log in to view and create activities.</p>
      </div>
    )
  }

  return (
    <div className="feeds">
      <h1>Activity Feeds</h1>

      <div className="create-activity">
        <h2>Create New Activity</h2>
        <form onSubmit={handleSubmit} className="activity-form">
          <select
            value={newActivity.verb}
            onChange={(e) => setNewActivity({ ...newActivity, verb: e.target.value })}
          >
            <option value="post">Post</option>
            <option value="like">Like</option>
            <option value="share">Share</option>
            <option value="comment">Comment</option>
          </select>
          <input
            type="text"
            placeholder="Object (e.g., post:123)"
            value={newActivity.object}
            onChange={(e) => setNewActivity({ ...newActivity, object: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Message (optional)"
            value={newActivity.message}
            onChange={(e) => setNewActivity({ ...newActivity, message: e.target.value })}
          />
          <button type="submit">Add Activity</button>
        </form>
      </div>

      <div className="feed-display">
        <h2>Your Feed</h2>
        {isLoading ? (
          <p>Loading activities...</p>
        ) : activities.length > 0 ? (
          <div className="activities-list">
            {activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-header">
                  <strong>{activity.actor}</strong>
                  <span className="activity-verb">{activity.verb}</span>
                  <span className="activity-object">{activity.object}</span>
                </div>
                {activity.message && (
                  <p className="activity-message">{activity.message}</p>
                )}
                <small className="activity-time">{new Date(activity.time).toLocaleString()}</small>
              </div>
            ))}
          </div>
        ) : (
          <p>No activities yet. Create your first activity above!</p>
        )}
      </div>
    </div>
  )
}

export default Feeds
