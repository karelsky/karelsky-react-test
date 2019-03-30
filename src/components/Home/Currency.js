import React from 'react';
import './Home.css';

const Currency = props => {
  const ratesData = props.rates;
  if (ratesData) {
    
    let date = new Date();
    date.setDate(date.getDate() + 1); //to subtract further

    return (
      <div>
        <ul className="no-punct">
        {

          ratesData.map(ratesDay => {

            /* The received objects contain dates and it's possible to fetch dates from them,
            although sometimes the objects in this API repeat (1-3 days), so the manual dates filling is used */

            date.setDate(date.getDate() - 1);
            let month = date.getMonth() + 1;
            if (month < 10) month = '0' + month;
            let dayMonth = date.getDate() + '.' + month;

            return (
              <li className="no-punct" key={ratesDay.date}>
                <ul className="no-punct">
                  <li className="rates-cell">{dayMonth}</li>
                  <li className="rates-cell">{ratesDay.rates.USD}</li>
                </ul>
              </li>
            );
          })
        }
        </ul>
      </div>
    );
  } else {
    return (
      <div>Loading Tags...</div>
    );
  }

};

export default Currency;
