import React, {useCallback, useEffect, useRef, useState } from 'react';
import { Heading } from './components/Heading';
import { UnsplashImage } from './components/UnsplashImage';
import { Loader } from './components/Loader';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

// Style
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
  }
`;

const WrapperImages = styled.section`
  max-width: 70rem;
  margin: 4rem auto;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: 300px;
`;

function App() {
  const [images, setImage] = useState([]);
  const searchInput = useRef(null);
  const [currentPage, setCurrentPage] = useState(1)

  const apiRoot = "https://api.unsplash.com";
  const accessKey = process.env.REACT_APP_ACCESSKEY;

  const getImages = useCallback(async () => { 
    try {
      console.log(searchInput.current.value)
      if (searchInput.current.value) {
          const { data } = await axios.get(`${apiRoot}/search/photos/?query=${searchInput.current.value}&page=${currentPage}&per_page=24&client_id=${accessKey}`)
          setImage([...images, ...data.results])
        }
      } catch (error) {
      }
  }, [currentPage])

  const handleSearch = useCallback((e) => { 
    e.preventDefault();
    setImage([]);
    setCurrentPage(1);
    getImages();
  }, [searchInput])

  const fetchImages = (count = 10) => {
    axios
      .get(`${apiRoot}/photos/random?client_id=${accessKey}&count=${count}`)
      .then(res => {
        setImage([...images, ...res.data]);
      })
  }
  useEffect(() => {
    fetchImages();
  }, [])
 
 useEffect(() => { setImage([]) }, [handleSearch])
  return (
    <div>
      
      <GlobalStyle />
      <div className='App-header'>
      <input
        className="corlor"
      
        placeholder="Search Anything..."
        ref={searchInput} type="text"
        />
         <button
        onClick={handleSearch}
       
      >Search</button>
      </div>
      <InfiniteScroll
        dataLength={images.length}
        next={fetchImages}
        hasMore={true}
        loader={<Loader />}
      >
        <WrapperImages>
          {images.map(image => (
            <UnsplashImage url={image.urls.thumb} />
          ))}
        </WrapperImages>
      </InfiniteScroll>
    </div>
  );
}

export default App;
