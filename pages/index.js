import Head from 'next/head'
import { useState, useEffect } from 'react';
import axios from 'axios';
import customData from './data/index.js';

export default function Home()
{
  const [lowRating, setLowRating] = useState(1400);
  const [highRating, setHighRating] = useState(1800);
  const [user, setUser] = useState('games.princeraj');
  const [data, setData] = useState([]);


  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    if (!user) {
      return;
    }
    const res = await axios.get(`https://codeforces.com/api/user.status?handle=${user}`)
    let solved = new Set()
    let dataToSet = []

    const resData = customData(lowRating, highRating);
    resData.sort((a, b) => b.frequency - a.frequency);

    setLowRating(Math.max(Math.min(3400, Math.round(lowRating / 100) * 100), 800));
    setHighRating(Math.max(Math.min(3400, Math.round(highRating / 100) * 100)), 900);

    for (let i = 0; i < res.data.result.length; i++) {
      if (res.data.result[i].verdict === 'OK') {
        solved.add(res.data.result[i].problem.contestId + '_' + res.data.result[i].problem.index)
      }
    }

    for (let i = 0; i < resData.length && dataToSet.length < 100; i++) {
      if (solved && !solved?.has(resData[i].contestId + '_' + resData[i].index)) {
        dataToSet.push(resData[i]);
      }
    }
    setData(dataToSet);
  }

  useEffect(async () =>
  {
    const res = await axios.get(`https://codeforces.com/api/user.status?handle=${user}`)
    const resData = customData(lowRating, highRating);
    resData.sort((a, b) => b.frequency - a.frequency);

    let dataToSet = []
    let solved = new Set()

    for (let i = 0; i < res.data.result.length; i++) {
      if (res.data.result[i].verdict === 'OK') {
        solved.add(res.data.result[i].problem.contestId + '_' + res.data.result[i].problem.index)
      }
    }
    for (let i = 0; i < resData.length && dataToSet.length < 100; i++) {
      if (solved && !solved?.has(resData[i].contestId + '_' + resData[i].index)) {
        dataToSet.push(resData[i])
      }
    }
    setData(dataToSet)
  }, [])

  return (
    <div className="container p-4 mt-2">
      <Head>
        <title>C3 Ladders</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-center">
        <form className="w-full max-w-sm p-4 bg-gray-200 rounded" onSubmit={handleSubmit}>
          <h2 className="text-center text-teal-500 text-xl font-bold mb-4">
            Codeforces Nice problems
          </h2>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3">
              <input type="number" placeholder='Lower Rating' value={lowRating} onChange={(e) => setLowRating(parseInt(e.target.value))} name='lower' className='appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
              <input type="number" placeholder='Upper Rating' value={highRating}
                onChange={(e) => setHighRating(parseInt(e.target.value))} name='upper' className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
            </div>
          </div>
          <div>
            <input type="text" onChange={(e) => setUser(e.target.value)} value={user}
              placeholder="Codeforces Handle" name='handle' className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
            {!user && <p className="text-red-500 text-xs px-4 italic">Please enter a username</p>}
          </div>
          <div className='flex item-start'>
            <div className='mx-auto py-2'>
              <button type='submit' className="flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-full text-white bg-teal-500 hover:bg-green-700"> Submit </button>
            </div>
          </div>
        </form>
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
                          {console.log(prob.tags)}
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
