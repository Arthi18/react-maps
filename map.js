import React,{useState, useCallback, useRef} from 'react';
import PropTypes from 'prop-types';
import { styled, alpha } from '@mui/material/styles';
import { GoogleMap, useJsApiLoader, Marker, InfoBox} from '@react-google-maps/api';
import Geocode from 'react-geocode';
import Box from '@mui/material/Box';
import { Button, Radio, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import MenuIcon from '@mui/icons-material/Menu';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Checkbox from '@mui/material/Checkbox';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { Icon } from '@iconify/react';

import './styles.css';


// search
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('md')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    border: '1px solid gainsboro',
    borderRadius:'0px',
    marginTop:'5px',
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

// tab panel
function TabPanel(props) {
  const { children, value, value1, index, ...other } = props;

  return (
    <>
    <div
      role="tabpanel"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2, paddingTop:2}}>
          <Typography>{children}</Typography>
        </Box>
      )}
          {value1 === index && (
      <Box sx={{ p: 2, paddingTop: 0 }}>
        <Typography>{children}</Typography>
      </Box>
    )}
    </div>
  </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  value1: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const jsonData = [
  { id: 1, label: 'Item 1' },
  { id: 2, label: 'Item 2' },
  { id: 3, label: 'Item 3' },
  { id: 4, label: 'Item 3' },
  { id: 5, label: 'Item 3' },
  { id: 6, label: 'Item 3' },
  { id: 7, label: 'Item 3' },
];
// style
const containerStyle = {
  width: '100%',
  height: '100vh',
  position:'relative'
};

const center = {
  lat: 20.5937,
  lng: 78.9629
};
// map data
const mapData = [
  { lat: 20.5937, lng: 78.9629 },
  { lat: 29.9475, lng: 58.3644 },
  { lat: 38.8327, lng: 68.6074 },
  { lat: 0.91726, lng: 8.83198 },
  { lat: 34.150002, lng: 16.647041},
];

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
// initial Markers
const initialMarkers = [
  { lat: 11.023374, lng: 76.965039 },
];

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
  });

// useState
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState(initialMarkers);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selected, setSelected] = useState(null);
  const [value, setValue] = useState('0');
  const [value1, setValue1] = useState('1');
  const [selectedMarkerLocation, setSelectedMarkerLocation] = useState(null);
  const [showMarkers, setShowMarkers] = useState(true);

const handleToggleMarkers = () => {
  setShowMarkers((prevShowMarkers) => !prevShowMarkers);
  setSelectedMarker(null);
};
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const handleChangeclick = (event, newValue) => {
    setValue1(newValue);
  };

  const getAddress = useCallback(async (lat, lng) => {
    try {
      const response = await Geocode.fromLatLng(lat.toString(), lng.toString());
      const address = response.results[0].formatted_address;
      return address;
    } catch (error) {
      console.error(error);
      return '';
    }
  }, []);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
      markers.forEach(marker => {
    bounds.extend(new window.google.maps.LatLng(marker.lat, marker.lng));
  });

  // Fit the map to the bounds
  map.fitBounds(bounds);

    const maxZoom = 12;
  const listener = window.google.maps.event.addListener(map, 'zoom_changed', () => {
    if (map.getZoom() > maxZoom) map.setZoom(maxZoom);
    window.google.maps.event.removeListener(listener);
  });
}, [markers]);


// side nav-bar lat-lng
const handleMarkerClick = (location) => {
  setSelectedMarkerLocation(location);
  setSelectedMarker(location);
};
// Marker infobox details
    const handleClick = async(e) => {
    const newMarker = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      address: await getAddress(e.latLng.lat(), e.latLng.lng()),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      time1: new Date().toLocaleTimeString(),
    };
    setMarkers([...markers, newMarker]);
    setSelectedMarker(newMarker);
    setSelected(newMarker);
  };
  
  // Toggle box 
  const [isToggleVisible, setIsToggleVisible] = useState(false);
  const [sideToggleVisible, setSideToggleVisible] = useState(false);

  const handleClicktoggle = () => {
    setIsToggleVisible(!isToggleVisible);
  };
  const handleClicksidetoggle = () => {
    setSideToggleVisible(!sideToggleVisible);
};

const toggleMarkerVisibility = (index) => {
  const updatedMarkers = [...markers];
  updatedMarkers[index].isVisible = !updatedMarkers[index].isVisible;
  setMarkers(updatedMarkers);
};
  
  return isLoaded ? (
    <>
    <Box className='container'>
    <GoogleMap ref={mapRef}
      mapContainerStyle={containerStyle}
      center={center}
      onLoad={onLoad}
      onClick={handleClick}
      className='container'
    >
{showMarkers &&
        markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => setSelectedMarker(marker)}
            className="marker"
          />
        ))}
      {selectedMarker && (
        <InfoBox       
          position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
          options={{boxClass: 'custom-infowindow', closeBoxURL: '',       pixelOffset: new window.google.maps.Size(-135, -125) }}                   
          onCloseClick={() => setSelectedMarker(null)}
          
        >          
        <Box onClick={(event) => event.stopPropagation()}>
            <Box style={{display:'flex', justifyContent:'space-evenly', alignItems:'center', height:'30px'}} >
              <Typography variant='h6' padding='0px 5px'>Info</Typography>
               <Tabs value={value} onChange={handleChange} indicatorColor="secondary"
                textColor="inherit">
                <Tab icon={<AddRoadIcon />} {...a11yProps(0)} />               
                <Tab icon={<MenuIcon />} {...a11yProps(1)} />
              </Tabs>
              <Icon icon="ic:baseline-close" style={{fontSize:'20px', color:'gray', cursor:'pointer'}}onClick={() => setSelectedMarker(null)}/>
            </Box>
         <div>
            <TabPanel value={value} index={0}>
              <Stack direction='row' width='100%'>
                <Box width='40%'>
                Latitude
                </Box>
                <Box width='10%'>
                  :
                </Box>
                <Box width='40%'>
                {selectedMarker.lat.toFixed(6)}
                </Box>
              </Stack>
              <Stack direction='row' width='100%'>
                <Box width='40%'>
                Longitude
                </Box>
                <Box width='10%'>
                  :
                </Box>
                <Box width='40%'>
                {selectedMarker.lng.toFixed(6)}
                </Box>
              </Stack>
            </TabPanel>
            <TabPanel value={value} index={1}>

              <Stack direction='row' width='100%'>
                <Box width='40%'>
                Address
                </Box>
                <Box width='10%'>
                  :
                </Box>
                <Box width='40%'>
                {selectedMarker.address || "Loading..."}
                </Box>
              </Stack>
              <Stack direction='row' width='100%'>
                <Box width='40%'>
                Date
                </Box>
                <Box width='10%'>
                  :
                </Box>
                <Box width='40%'>
                {selectedMarker.date}
                </Box>
              </Stack>
              <Stack direction='row' width='100%'>
                <Box width='40%'>
                Time
                </Box>
                <Box width='10%'>
                  :
                </Box>
                <Box width='40%'>
                {selectedMarker.time}
                </Box>
              </Stack>
            </TabPanel>
          </div>
        </Box>
        </InfoBox>       
      )}

      <div className='topnav'>
        <div className='top-logo'>
          <img src='logo.svg' alt="LOGO"/>
        </div>
        <div className='nav-icons'>
        <Icon icon="carbon:tools" className='topnav-icons'/>
        <Icon icon="solar:settings-linear" className='topnav-icons'/>
        <Icon icon="fluent:chat-multiple-16-regular" className='topnav-icons'/>
        <Icon icon="iconamoon:profile-circle-light" className='topnav-icons' />
        </div>
      </div>

    <div className='togglebox1'>
      <div className='side-navbar'>
        {sideToggleVisible &&
                <div className='side-content' id='toggle'>
      <Tabs value={value1} onChange={handleChangeclick} indicatorColor="secondary" 
                textColor="inherit" >
                  <Tab label="Objects" {...a11yProps(0)} />
                  <Tab label="Events" {...a11yProps(1)} />
                  <Tab label="History" {...a11yProps(2)} />
          </Tabs>
                  <Box width='100%'>
                  <Search >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
                  </Box>
                  <TabPanel value={value1} index={0}>
                  {jsonData.map((item) => (
              <Stack key={item.id} direction='row' width='100%' columnGap={1} paddingBottom={1} alignItems='center'>
                <Box width='10%'><Checkbox {...label} defaultChecked /></Box>
                <Box width='68%'><TextField size="small" placeholder='Enter' /></Box>
                <Box width='5%'><CloudQueueIcon style={{color:'gray'}}/></Box>
                <Box width='8%'><Radio /></Box>
                <Box width='8%'><MoreVertIcon  className='icon'/></Box>
              </Stack>
            ))}

                  </TabPanel>
                  <TabPanel value={value1} index={1} ref={mapRef}>
                    {mapData.map((marker, index) => (
                      <Button key={index} onClick={() => handleMarkerClick(marker)}>
                        Lat: {marker.lat}, Lng: {marker.lng}
                      </Button>
                    ))}
                  </TabPanel>
                  <TabPanel value={value1} index={2}>
                    <Stack direction="column" width='100%'rowGap={2} alignItems='center'>
                    <Stack direction="row" width='100%' alignItems='center'>
                      <Box width='25%'>
                        <Typography>Device</Typography>
                      </Box>
                      <Box width='80%'>
                        <TextField variant='outlined' size='small' placeholder='Enter Device Name' />
                      </Box>
                    </Stack>
                    <Stack direction="row" width='100%' alignItems='center'>
                      <Box width='20%'>
                        <Typography>From</Typography>
                      </Box>
                      <Box width='80%' display='flex' justifyContent='space-between'>
                      <Box width='40%'>
                        <TextField variant='outlined' size='small' placeholder='Enter ' />
                      </Box>
                      <Box width='40%'>
                        <TextField variant='outlined' size='small' placeholder='Enter' />
                      </Box>
                      </Box>
                    </Stack>
                    <Stack direction="row" width='100%' alignItems='center'>
                      <Box width='20%'>
                        <Typography>To</Typography>
                      </Box>
                      <Box width='80%' display='flex' justifyContent='space-between'>
                      <Box width='40%'>
                        <TextField variant='outlined' size='small' placeholder='Enter ' />
                      </Box>
                      <Box width='40%'>
                        <TextField variant='outlined' size='small' placeholder='Enter' />
                      </Box>
                      </Box>
                    </Stack>
                    <Box alignItems='flex-end' width='100%' justifyContent='flex-end' display='flex'>
                      <Typography color='darkcyan'>ADVANCED</Typography>
                    </Box>
                    <Stack direction='row' width='100%' alignItems='center' columnGap={1}>
                    <Box width='60%'>
                      <button className='history-btn'>Show History</button>
                    </Box>
                    <Box width='20%' className='history-iconbox'>
                    <Icon icon="material-symbols:download-rounded" className='history-icon'/>
                    </Box>
                    <Box width='20%' className='history-iconbox'>
                    <Icon icon="ic:baseline-close" className='history-icon'/>
                    </Box>
                    </Stack>
                    </Stack>
                  </TabPanel>

        </div>}
        <div className='toggle-div'>
        <button onClick={handleClicksidetoggle} className='btn-toggle1' >
      {sideToggleVisible ? <Icon icon="material-symbols:keyboard-arrow-down" className='arrow1'/> : <Icon icon="material-symbols:keyboard-arrow-up" className='arrow1'/>}
      </button>
        </div>
        </div>
    </div>

      <div className='togglebox'>
      <div className='down-box' >
      <div className='toggle-div'>
      <button onClick={handleClicktoggle} className='btn-toggle'>
      {isToggleVisible ? <Icon icon="material-symbols:keyboard-arrow-down" className='arrow'/> : <Icon icon="material-symbols:keyboard-arrow-up" className='arrow'/>}
      </button>
      </div>
      {isToggleVisible &&
        <Table id='toggle'>
          <TableHead>
            <TableRow sx={{backgroundColor:'#eeeeee'}}>
              <TableCell>
                <Stack direction='row' width='100%'>
                  <Box width='8%'><Icon icon="ion:navigate-outline" className='icon'/></Box>
                  <Box width='42%'>Citroen Jumper</Box>
                  <Box width='5%'><Icon icon="ph:dot-outline" className='icon'/></Box>
                  <Box width='45%'>ACK</Box>
                  </Stack></TableCell>
              <TableCell>
                <Stack direction='row' width="100%">
                  <Box width='15%'><Icon icon="ic:outline-sensors"  className='icon'/></Box>
                  <Box width='85%'>Sensors</Box>
                  </Stack></TableCell>
              <TableCell>
              <Stack direction='row' width="100%">
                <Box width='15%'><Icon icon="material-symbols:photo-camera-outline" className='icon'/></Box>
                <Box width='85%'>Street View</Box>
                </Stack></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <tr>
              <td> 
                <Stack direction='row' width='100%'>          
                <Box width='50%'> Address</Box>
                <Box width='50%'><Icon icon="icon-park:loading" className='icon'/><Icon icon="healthicons:eye-negative" className='icon'/></Box>
                {/* <Box width='25%'><Icon icon="healthicons:eye-negative" className='icon'/></Box> */}
              </Stack>
              </td>
              <td>
              <Stack direction='row' width='100%'>          
                <Box width='15%'><Icon icon="material-symbols:wifi-tethering-rounded" className='icon'/></Box>
                <Box width='55%'> Accuracy</Box>
                <Box width='40%'>0.75</Box>
              </Stack>
              </td>
            </tr>
            <tr>
              <td> 
                <Stack direction="row" width="100%">
                  <Box width="50%">Time</Box>
                  <Box width="50%">          
                      {selected && (<>{selected.time1 || "Loading..."}</>)} 
                  </Box>
                    </Stack>

              </td>
              <td>
              <Stack direction='row' width='100%'>          
                <Box width='15%'><Icon icon="material-symbols:wifi-tethering-rounded" className='icon'/></Box>
                <Box width='55%'>Satellites</Box>
                <Box width='40%'>11</Box>
              </Stack>
              </td>
            </tr>
            <tr>
              <td> 
              <Stack direction='row' width='100%'>          
                <Box width='50%'>Stop Duration</Box>
                <Box width='50%'>00:00:00</Box>
              </Stack>
              </td>
              <td>
              <Stack direction='row' width='100%'>          
                <Box width='15%'><Icon icon="icon-park-solid:speed-one" className='icon'/></Box>
                <Box width='55%'> Speed</Box>
                <Box width='40%'>234</Box>
              </Stack>
              </td>
            </tr>
            <tr>
              <td> 
              <Stack direction='row' width='100%'>          
                <Box width='50%'> Driver</Box>
                <Box width='50%'>Address</Box>
              </Stack>
              </td>
            </tr>
          </TableBody>
        </Table>}
        </div>
      </div>

      <div className='nav-iconbar'>
        <Box marginBottom={1}>
          <Icon icon="material-symbols:open-with-rounded"  className='nav-icon'/>
        </Box>
        <Box marginBottom={1}>
          <Icon icon="material-symbols:map-outline" className='nav-icon'/>
        </Box>
        <Box marginBottom={1} display='flex' flexDirection='column'>
          <Icon icon="ic:outline-plus" className='nav-icon'/>
        <Icon icon="ic:baseline-minus" className='nav-icon'/>
      </Box>
        <Icon icon="material-symbols:counter-3" className='nav-icon' />
        <Icon icon="ion:navigate-outline" className='nav-icon'/>
        <Icon icon="ic:twotone-add-road" className='nav-icon'/>
        <Icon icon="mdi:vector-triangle" className='nav-icon'/>
        <Icon
      icon={showMarkers ? "mdi:map-marker-outline" : "mdi:map-marker-off-outline"}
      className="toggle-markers-icon nav-icon"
      onClick={handleToggleMarkers}
    />
        <Icon icon="material-symbols:arrow-outward-rounded" className='nav-icon'/>
        <Icon icon="ph:traffic-signal-bold" className='nav-icon'/>
      </div>
    
      </GoogleMap>
    </Box>
</>
  ) : (
    <></>
  );
}
export default MyComponent;

