"use client";

import { useState, useEffect } from "react";
import Avatar from "boring-avatars";
import {
  FaRegCircleXmark,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa6";

import Controls from "./controls";
import Modal from "./modal";

import { User } from "./types/user";

export type GalleryProps = {
  users: User[];
};
const Gallery = ({ users }: GalleryProps) => {
  const [usersList, setUsersList] = useState(users);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States for storing the sorting field and direction
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<string | null>(null);

  const handleSortChange = (field: string, direction: string) => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Helper function to access nested fields
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((value, key) => value?.[key], obj);
  };

  useEffect(() => {
    if (sortField && sortDirection) {
      const sortedUsers = [...users].sort((a, b) => {
        let aValue, bValue;

        // Sort by nested fields depending on the sortField value
        switch (sortField) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'company':
            aValue = getNestedValue(a, 'company.name');
            bValue = getNestedValue(b, 'company.name');
            break;
          case 'email':
            aValue = a.email;
            bValue = b.email;
            break;
          default:
            return 0;
        }

        // Handle sorting direction
        if (aValue < bValue) {
          return sortDirection === 'ascending' ? -1 : 1;
        } else if (aValue > bValue) {
          return sortDirection === 'ascending' ? 1 : -1;
        }
        return 0;
      });

      setUsersList(sortedUsers);
    }
  }, [sortField, sortDirection, users]);

  const handleModalOpen = (id: number) => {
    const user = usersList.find((item) => item.id === id) || null;

    if (user) {
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  return (
    <div className="user-gallery">
      <div className="heading">
        <h1 className="title">Users</h1>
        <Controls onSortChange={handleSortChange} />
      </div>
      <div className="items">
        {usersList.map((user, index) => (
          <div
            className="item user-card"
            key={index}
            onClick={() => handleModalOpen(user.id)}
          >
            <div className="body">
              <Avatar
                size={96}
                name={user.name}
                variant="marble"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            </div>
            <div className="info">
              <div className="name">{user.name}</div>
              <div className="company">{user.company.name}</div>
            </div>
          </div>
        ))}
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <div className="user-panel">
            <div className="header">
              <div
                role="button"
                tabIndex={0}
                className="close"
                onClick={handleModalClose}
              >
                <FaRegCircleXmark size={32} />
              </div>
            </div>
            <div className="body">
              {selectedUser && (
                <div className="user-info info">
                  <div className="avatar">
                    <Avatar
                      size={240}
                      name={selectedUser.name}
                      variant="marble"
                      colors={[
                        "#92A1C6",
                        "#146A7C",
                        "#F0AB3D",
                        "#C271B4",
                        "#C20D90",
                      ]}
                    />
                  </div>
                  <div className="name">
                    {selectedUser.name} ({selectedUser.username})
                  </div>
                  <div className="field">
                    <FaLocationDot className="icon" />
                    <div className="data">{`${selectedUser.address.street}, ${selectedUser.address.suite}, ${selectedUser.address.city}`}</div>
                  </div>
                  <div className="field">
                    <FaPhone className="icon" />
                    <div className="value">{selectedUser.phone}</div>
                  </div>
                  <div className="fields">
                    <FaEnvelope className="icon" />
                    <div className="value">{selectedUser.email}</div>
                  </div>
                  <div className="company">
                    <div className="name">{selectedUser.company.name}</div>
                    <div className="catchphrase">
                      {selectedUser.company.catchPhrase}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Gallery;
