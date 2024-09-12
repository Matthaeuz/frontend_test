"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Gallery from "./gallery";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

// A separate API function for fetching company data
const fetchCompanyData = async (quantity: number) => {
  const response = await fetch(`https://random-data-api.com/api/company/random_company?size=${quantity}`);
  const data = await response.json();
  return data;
};

// A separate API function for fetching user data
const fetchUserData = async (quantity: number) => {
  const response = await fetch(`https://randomuser.me/api/?results=${quantity}`);
  const data = await response.json();
  return data.results;
};

// A function to combine user and company data
const combineUserDataWithCompanyData = async () => {
  try {
    const [userData, companyData] = await Promise.all([
      fetchUserData(10),
      fetchCompanyData(10),
    ]);

    return userData.map((user: any, index: number) => ({
      id: index + 1,
      name: `${user.name.first} ${user.name.last}`,
      username: user.login.username,
      email: user.email,
      address: {
        street: user.location.street.name,
        suite: user.location.street.number.toString(),
        city: user.location.city,
      },
      phone: user.phone,
      company: {
        name: companyData[index].business_name,
        catchPhrase: companyData[index].catch_phrase,
      },
    }));
  } catch (error) {
    console.error("Error combining data:", error);
    return [];
  }
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const combinedUsers = await combineUserDataWithCompanyData();
      setUsers(combinedUsers);
    };

    fetchData();
  }, []);

  return (
    <main className={styles.main}>
      {/* Pass the fetched users to the Gallery component */}
      {users.length > 0 ? <Gallery users={users} /> : <p>Loading users...</p>}
    </main>
  );
}
