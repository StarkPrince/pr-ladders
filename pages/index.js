import Head from 'next/head'
import { useState, useEffect, useCallback } from 'react';
import customData from './data/index.js';
import axios from 'axios';
import { debounce } from "lodash";
import { toast } from 'react-toastify';

export default function Home()
{
  const request = debounce((func, val) =>
  {
    func(val);
  }, 1000);

  const [lowRating, setLowRating] = useState(1400);
  const [highRating, setHighRating] = useState(1800);
  const [user, setUser] = useState('games.princeraj');
  const [data, setData] = useState([]);

  const debouceRequest = useCallback((func, val) => request(func, val), []);

  const onLowRatingChange = e =>
  {
    debouceRequest(setLowRating, parseInt(e.target.value));
  };

  const onHighRatingChange = e =>
  {
    debouceRequest(setHighRating, parseInt(e.target.value)); // Remove this line will lead to normal denounce
  };

  const onUserChange = e =>
  {
    debouceRequest(setUser, e.target.value); // Remove this line will lead to normal denounce
  };

  useEffect(() =>
  {
    let solved = new Set()
    var res;
    const fetchData = async () =>
    {
      res = await axios.get(`https://codeforces.com/api/user.status?handle=${user}`)
      for (let i = 0; i < res?.data.result.length; i++) {
        if (res.data.result[i].verdict === 'OK') {
          solved.add(res.data.result[i].problem.contestId + '_' + res.data.result[i].problem.index)
        }
      }
    }
    fetchData();

    const resData = customData(lowRating, highRating);
    resData.sort((a, b) => b.frequency - a.frequency);
    let dataToSet = []

    for (let i = 0; i < resData.length && dataToSet.length < 100; i++) {
      if (solved && !solved?.has(resData[i]?.contestId + '_' + resData[i]?.index)) {
        dataToSet.push(resData[i])
      }
    }
    setData(dataToSet)
  }, [user, lowRating, highRating])

  return (
    <div className="container p-4 mt-2">
      <Head>
        <title>C3 Ladders</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-center">
        <div className="w-full max-w-sm p-4 bg-gray-200 rounded">
          <h2 className="text-center text-teal-500 text-xl font-bold mb-4">
            {user}
          </h2>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3">
              <input type="number" placeholder='Lower Rating' onChange={(e) => onLowRatingChange(e)} name='lower' className='appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
              <input type="number" placeholder='Upper Rating'
                onChange={(e) => onHighRatingChange(e)} name='upper' className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
            </div>
          </div>
          <div>
            <input type="text" onChange={e => onUserChange(e)}
              placeholder="Codeforces Handle" name='handle' className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
            {!user && <p className="text-red-500 text-xs px-4 italic">Please enter a username</p>}
          </div>
        </div>
      </div>
      {data.length > 0 &&
        <div className="container p-4 m-6 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((prob, i) =>
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              <a href={`https://codeforces.com/problemset/problem/${prob.contestId}/${prob.index}`}>
                                {prob.name}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{prob.rating}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap mx-auto">
                          <div className="text-sm text-gray-900">{prob.frequency}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className='flex flex-row'>

                            <div className="text-sm text-gray-600">{prob.tags.slice(0, 3).join(",")}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    </div >
  )
}
