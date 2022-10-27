import {  useEffect,useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from 'theme/theme';
import { ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Container } from './Container/Container';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Notification } from './Notification/Notification';
import { Modal } from './Modal/Modal';

import * as API from './services/api.js'

export const App = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('idle');
  const [showModal, setShowModal] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(null);
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(true);
  
  useEffect(() => {
    if (loader) {
      return
    };
    
    const fetchImages = async () => {
      setStatus('pending');
      await API.getData(query, page)
         .then(resp => {
      const { totalHits, hits } = resp.data;
           
      if (hits.length === 0 ) {
        throw new Error('No results for your search.');
           };

      setData([...data, ...hits]);
               
      if ((data.length + 12) >= totalHits) {
     setStatus('idle');
     toast(`A total of ${totalHits} results were shown, there are no more photos for this query.`);   
      return;
           };
             
       if (data.length === 0) {
      toast(`${totalHits} images were found for your request.`);
           };    
      setStatus('resolved');
    })
    .catch(error => handleError(error))
    }

    fetchImages(query, page)
    setLoader(true);
  },[data, page, query, loader])

  const handleError = error => {
    setStatus('rejected');
    setError(error.message)
   }
  
  const handleQuerySubmit = query => {
    setPage(1);
    setQuery(query);
    setData([]);
    setLoader(false);
  }

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
    setLoader(false);
  }
  
  const toggleModal = id => {
    const photoIdx = data.findIndex(el => el.id === id);
    setShowModal(!showModal);
    setPhotoIdx(photoIdx)
  }

  const { largeImageURL, tags } = data[photoIdx] ?? '';
  
  return (
      <ThemeProvider theme={theme}>
      <Searchbar onSubmit={handleQuerySubmit} newQuery={query} data={data}/>
        <Container display="flex" flexDirection="column" alignItems="center" padding="3">
          {data.length !== 0 && <ImageGallery data={data} query={query} toggleModal={toggleModal}/>}
          {status === 'rejected' && <Notification error={error} />}
          {status === 'pending' && <Loader />}
          {status === 'resolved'  && <Button loadMore={loadMore}/>}
        </Container>
      {showModal && <Modal toggleModal={toggleModal}><img src={largeImageURL} alt={tags}/></Modal>}
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false} 
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"/>
    </ThemeProvider>   
  )
}