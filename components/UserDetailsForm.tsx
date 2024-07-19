import { useState } from "react";

type UserDetailsFormProps = {
  initialValues: {
    name: string;
    mobile_number: string;
    date_of_birth: string;
    profession: string;
    gender: string;
  };
  onUpdate: (updatedUser: Partial<UserType>) => void;
  onCancel: () => void;
};

const UserDetailsForm = ({
  initialValues,
  onUpdate,
  onCancel,
}: UserDetailsFormProps) => {
  const [name, setName] = useState(initialValues.name);
  const [mobileNumber, setMobileNumber] = useState(initialValues.mobile_number);
  const [dateOfBirth, setDateOfBirth] = useState(initialValues.date_of_birth);
  const [profession, setProfession] = useState(initialValues.profession);
  const [gender, setGender] = useState(initialValues.gender);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate({
      name,
      mobile_number: mobileNumber,
      date_of_birth: dateOfBirth,
      profession,
      gender,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Mobile Number:</label>
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </div>
      <div>
        <label>Profession:</label>
        <input
          type="text"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
        />
      </div>
      <div>
        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="not_mentioned"> Want to Mention</option>
        </select>
      </div>
      <div className="flex justify-end space-x-4 mt-4">
        <button
          type="submit"
          className="bg-custom-pri text-white px-4 py-2 rounded shadow-md"
        >
          Update
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded shadow-md"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserDetailsForm;
