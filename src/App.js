import { useState, useEffect } from "react";
import { ReactComponent as AddUserBtn } from "./icons/addUser.svg";
import { ReactComponent as CloseBtn } from "./icons/close.svg";

import shortid from "shortid";
import ContactForm from "./components/ContactForm";
import Filter from "./components/Filter";
import ContactList from "./components/ContactList";
import Container from "./components/Container";
import Modal from "./components/Modal";
import Section from "./components/Section";
import Notiflix from "notiflix";
import IconButton from "./components/IconButton";

export default function App() {
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState(() => {
    return JSON.parse(localStorage.getItem("contacts")) ?? [];
  });
  useEffect(() => {
    window.localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (name, number) => {
    toggleModal();

    const contact = {
      id: shortid.generate(),
      name,
      number,
    };

    if (
      contacts.find(
        (contact) => contact.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      Notiflix.Notify.failure(`${name} is already in contacts.`);
    } else if (contacts.find((contact) => contact.number === number)) {
      Notiflix.Notify.failure(`${number} is already in contacts.`);
    } else if (name.trim() === "" || number.trim() === "") {
      Notiflix.Notify.failure("Enter the contact's name and number phone!");
    } else {
      setContacts((prevContacts) =>
        [contact, ...prevContacts].sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          return 0;
        })
      );
    }
  };

  const toggleModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  const deleteContact = (contactId) => {
    setContacts(contacts.filter(({ id }) => id !== contactId));
  };

  const changeFilter = (event) => {
    setFilter(event.currentTarget.value);
  };

  const getVisibleContacts = () => {
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(normalizedFilter)
    );
  };

  return (
    <Container>
      {showModal && (
        <Modal onClose={toggleModal}>
          <ContactForm onSubmit={addContact} />
          <IconButton onClick={toggleModal}>
            <CloseBtn className="closeModal" />
          </IconButton>
        </Modal>
      )}

      <Section title="Phonebook">
        <IconButton onClick={toggleModal}>
          <AddUserBtn className="openModal" />
        </IconButton>
      </Section>

      <Section title="Contacts">
        {contacts.length > 0 && (
          <Filter value={filter} onChange={changeFilter} />
        )}
        {contacts.length > 0 ? (
          <ContactList
            contacts={getVisibleContacts()}
            onDeleteContact={deleteContact}
          />
        ) : (
          <p className="notification">
            Your phonebook is empty. Please add contact.
          </p>
        )}
        {filter.length >= getVisibleContacts() && (
          <p className="notification">No matches found.</p>
        )}
      </Section>
    </Container>
  );
}
