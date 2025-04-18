export function useGeolocationSharing(interval = 5000) {
  let watcher = null
  let timer = null

  const sendLocation = (position) => {
    const { latitude, longitude } = position.coords
    axios.post('/api/locations', { latitude, longitude })
  }

  const start = () => {
    if ('geolocation' in navigator) {
      watcher = navigator.geolocation.watchPosition(sendLocation, console.error, {
        enableHighAccuracy: true
      })

      // Backup: ส่งตำแหน่งทุก interval
      timer = setInterval(() => {
        navigator.geolocation.getCurrentPosition(sendLocation, console.error)
      }, interval)
    }
  }

  const stop = () => {
    if (watcher) navigator.geolocation.clearWatch(watcher)
    if (timer) clearInterval(timer)
  }

  onMounted(start)
  onUnmounted(stop)

  return { start, stop }
}
