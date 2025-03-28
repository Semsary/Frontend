/*

main users website
===================

1- Authntacation 
a) Login
b) Signup
d) Reset Password
e) Logout



------------------------------------
2- Home Page
a) Navbar
c) Filter (location, price, type)
d) List of Apartments (image, location, price, type, rating) 
-> pagination (20 per page) - infinite scroll 
e) can add apartment to favorite list


------------------------------------
3- Apartment details
a) apartment data (image, location, price, type, rating, services, amenities, nearby places , created_at ,owner data , status, number of available units)

b) request rent button (start date, end date,rent type) 




------------------------------------
3- Profile Page




------------------------------------
4- User Apartment

a) ask for review
-> review function (add, edit, delete, view)
-> review data "for one user" (id, home Adders, created_at, updated_at ,status )


b) after review accepted by admin, user can see the home data
-> home data (id,Adders,location, services, amenities, nearby places , created_at ...)

c) user can change the Apartment status (published, not published)
d) user can delete the Apartment 



------------------------------------
5- User Messages
a) the user can send a message to home owner
b) the home owner can send a message to the landlord
c) the Tenant can send a message to the customer service 

-> using websockets to send and receive messages



------------------------------------
6- User Notifications
a) the landlord can see the notifications of (reviews status, messages, rent requests, ...)


------------------------------------
7- User payment

a) the user can deposit money to his account
b) the user can pay the rent to the landlord
c) the landlord can withdraw money from his account
d) the user can see his transactions



------------------------------------
8- User Rent Request
a) the user can send a rent request (unit id, start date, end date,rent type)
b) the system will check the availability of the unit and check the user balance 
c) the landlord can accept or reject the rent request























Dashboard website
===================

Manage Apartment
------------------
1- can see all apartments reviews requested by users
-> review data "for Dashboard" (id, user_id, home Adders, created_at, updated_at ,status )

2- after reviews Accepted by admin, admin fill the home data 
-> home data (id,Adders,location, services, amenities, nearby places , created_at ...)































*/
