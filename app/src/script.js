// app/src/script.js
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Aragon, { events } from '@aragon/api'

const app = new Aragon()

app.store(
  async (state, { event }) => {
    const nextState = {
      ...state,
    }

    try {
      switch (event) {
        case 'Flagged':
          return { ...nextState }
        case 'Liked':
          return { ...nextState }
        case 'Blacklisted':
          return { ...nextState }
        case 'Featured':
          return { ...nextState }
        case events.SYNC_STATUS_SYNCING:
          return { ...nextState, isSyncing: true }
        case events.SYNC_STATUS_SYNCED:
          return { ...nextState, isSyncing: false }
        default:
          return state
      }
    } catch (err) {
      console.log(err)
    }
  },
  {
    init: initializeState(),
  }
)

/***********************
 *   Event Handlers    *
 ***********************/

function initializeState() {
  return async cachedState => {
    return {
      ...cachedState
    }
  }
}

async function campaignFlagCount(idx) {
  // Get current value from the contract by calling the public getter
  // app.call() returns a single-emission observable that we can immediately turn into a promise
  return parseInt(await app.call('campaignFlagCount', idx).toPromise(), 10)
}

async function campaignLikeCount(idx) {
  // Get current value from the contract by calling the public getter
  // app.call() returns a single-emission observable that we can immediately turn into a promise
  return parseInt(await app.call('campaignLikeCount', idx).toPromise(), 10)
}
