import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { Edit, Delete } from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BASE_API_URL } from "../App"; // Ensure this is the correct import path


interface Card {
  _id: string;
  mainHeader: string;
  description: string;
  image: string;
}

const CardManagementPage: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  const API_URL = `${BASE_API_URL}/cards`;

  // Fetch cards from the backend
  const fetchCards = async () => {
    try {
      const response = await axios.get(API_URL);
      setCards(response.data);
    } catch (err) {
      console.error('Error fetching cards:', err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Handle input change for form data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedFormData = formData || new FormData();
    updatedFormData.set(name, value);
    setFormData(updatedFormData);
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updatedFormData = formData || new FormData();
      updatedFormData.set('image', file);
      setFormData(updatedFormData);
    }
  };

  // Add or edit card
  const handleSubmit = async () => {
    try {
      if (modalType === 'add') {
        await axios.post(API_URL, formData);
      } else if (modalType === 'edit' && selectedCard) {
        await axios.put(`${API_URL}/${selectedCard._id}`, formData);
      }
      fetchCards();
      setShowModal(false);
      setFormData(null);
      setSelectedCard(null);
    } catch (err) {
      console.error('Error saving card:', err);
    }
  };

  // Delete card
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCards();
    } catch (err) {
      console.error('Error deleting card:', err);
    }
  };

  // Open modal for adding or editing a card
  const openModal = (type: 'add' | 'edit', card?: Card) => {
    setModalType(type);
    setSelectedCard(card || null);
    setFormData(null);
    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Card Management</h2>
      <Button variant="primary" className="mb-3" onClick={() => openModal('add')}>
        Add Card
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Main Header</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card, index) => (
            <tr key={card._id}>
              <td>{index + 1}</td>
              <td>{card.mainHeader}</td>
              <td>{card.description}</td>
              <td>
                <img src={card.image} alt="Card" style={{ width: '100px', height: 'auto' }} />
              </td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => openModal('edit', card)}
                >
                  <Edit fontSize="small" />
                </Button>
                <Button variant="danger" onClick={() => handleDelete(card._id)}>
                  <Delete fontSize="small" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Adding/Editing Card */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'add' ? 'Add Card' : 'Edit Card'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Main Header</Form.Label>
              <Form.Control
                type="text"
                name="mainHeader"
                defaultValue={selectedCard?.mainHeader || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                defaultValue={selectedCard?.description || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleImageChange} />
              {selectedCard?.image && (
                <img
                  src={selectedCard.image}
                  alt="Card Preview"
                  style={{ width: '100px', height: 'auto', marginTop: '10px' }}
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {modalType === 'add' ? 'Add Card' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CardManagementPage;
