
## IEC2021023

Frontend URL : https://dww65pcjcx8nu.cloudfront.net/

Backend URL : https://prathdev.ddns.net/


## Note : As i do not have domain name we have to change some chrome settings to see the deployment
## do these steps after login or signing up
![image](https://github.com/user-attachments/assets/ad9cc766-6400-4220-a83a-72fdc13b8133)

open developer console=>application=>Cookies

set the HTTPOnly true
Secure True
and SameSite None

## Tech Stack

**Client:** React, TailwindCSS

**Server:** Node, Express, MongoDB


## Deployment

To run this project run

make sure you have .env file

```bash
    cd .\backend\
    npm i
    npm run dev
```
Open Another Terminal
```bash
    cd .\frontend\
    npm i
    npm run dev
```

## Limitation

Backend Team have to insert data by themselves there is no frontend to 
make entries in DB

Once the entry is made in db it cannot be changed 

