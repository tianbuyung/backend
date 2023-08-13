# Employee Management System API

## Table Of Contents

- [Employee Management System API](#employee-management-system-api)
  - [Table Of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)

---

## Introduction

The Employee Management System is a web app designed to simplify the process of managing company employees. It allows users to manage their employees records, including personal details, employment history, skills, and performance reviews. The system provides powerful search capabilities, making it easy for managers to find the right person for each job. Additionally, the system integrates seamlessly with existing HR systems, ensuring data accuracy and reducing errors.

One of the main benefits of using the Employee Management System is improved efficiency. By centralizing all employee data in one place, businesses save time and money spent on locating and organizing employee information across different systems. With quick access to critical information, employees can perform their jobs more effectively, resulting in increased productivity.

Another advantage of the Employee Management System is better decision-making. Managers have instant access to accurate, up-to-date information about their staff, enabling them to make sound decisions faster. For instance, they can easily identify high performing employees for promotion, recognize outstanding work, and reward exceptional contributions.

In conclusion, the Employee Management System is a valuable tool for companies looking to streamline employee management processes, improve efficiency, and enhance decision-making. Its user friendly design, robust functionality, and integration with existing systems makes it an ideal solution for organizations of all sizes.

---

## Installation

To install this project, follow these steps:

1. Clone the repository
2. Install dependencies with npm install
3. Start the server with npm start

---

## Usage

1. Open the Postman application on your computer.
2. Create a new request by clicking on the "New" button in the top-left corner.
3. Select the "POST" method from the drop-down menu.
4. Enter the URL for the register endpoint in the "URL" field, which is <http://localhost:3500/register>.
5. Click on the "Body" tab and select "Raw" from the "Body" dropdown menu.
6. Choose "JSON" from the "Format" dropdown menu.
7. Add the following JSON code to the body of the request:

   ```json
   {
     "username": "your_username",
     "password": "password"
   }
   ```

8. Replace "your_username" with your desired username and "password" with your desired password.
9. Click on the "Send" button to make the request.
10. If the request is successful, you will receive a JSON response with a "token" field.
11. Copy the value of the "token" field and use it to authenticate future requests to the API.
12. You can now use the token to make requests to the other endpoints, such as the login endpoint or the employee endpoints.

---

## Contributing

If you would like to contribute to this project, please follow these guidelines:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Open a pull request

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE.md) file for details.

---

## Contact

If you have any questions about this project, please contact me at [email](mailto:septianm028@gmail.com). You can also visit my GitHub profile at [username](https://github.com/tianbuyung).
