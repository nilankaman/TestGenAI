// Drop this at the top of GeneratePage.jsx, replacing the existing useState tab line:
// const [tab, setTab] = useState('manual')
// With:
// const location = useLocation()
// const [tab, setTab] = useState(location.state?.tab || 'manual')
// Also add: import { useLocation } from 'react-router-dom'
echo "instructions written"
