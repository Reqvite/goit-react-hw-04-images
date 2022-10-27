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

  

  useEffect(() => {
    setStatus('pending');
    getData(query, page)
    .then(resp => updateData(resp))
    .catch(error => handleError(error))
  },[getData, page, query, updateData])


 const updateData = resp => {
  const {totalHits, hits} = resp.data
      if (hits.length === 0 ) {
        throw new Error('No results for your search.');
    };
   if ((data.length + 12) >= totalHits) {
     setData([...data, ...hits]);
     setStatus('idle');
     toast(`A total of ${totalHits} results were shown, there are no more photos for this query.`);   
      return;
    }
    if (data.length === 0) {
      toast(`${totalHits} images were found for your request.`);
   };
   setData([...data, ...hits]);
   setStatus('resolved');
  }

  const handleError = error => {
    setStatus('rejected');
    setError(error.message)
   }
  
  
  const handleQuerySubmit = query => {
    setPage(1);
    setQuery('');
    setData([])
  }

  const getData = async (newQuery) => {
      return await API.getData(newQuery, page);
  } 

  const loadMore = () => {
    setPage(prevPage => prevPage + 1)
  }
  
  const toggleModal = id => {
    const photoIdx = data.findIndex(el => el.id === id);
    setShowModal(!showModal);
    setPhotoIdx(photoIdx)
  }

  const { largeImageURL, tags } = data[photoIdx] ?? '';
  
  return (
      <ThemeProvider theme={theme}>
        <Searchbar onSubmit={handleQuerySubmit} newQuery={query}/>
        <Container display="flex" flexDirection="column" alignItems="center" padding="3">
          {data.length !== 0 &&
          (<ImageGallery data={data} query={query} toggleModal={toggleModal}/>)}
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