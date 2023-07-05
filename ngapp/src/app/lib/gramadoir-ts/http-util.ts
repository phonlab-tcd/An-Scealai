async function get<RECEIVE>(url: string): Promise<RECEIVE> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Request failed');
    }

    const responseJson = await response.json();
    const data: RECEIVE = (typeof responseJson) == 'string' ? JSON.parse(responseJson) : responseJson;
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function post<SEND, RECEIVE>(url: string, body: SEND): Promise<RECEIVE> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error('Request failed');
    }
    
    const responseJson = await response.json();
    const data: RECEIVE = (typeof responseJson) == 'string' ? JSON.parse(responseJson) : responseJson;
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export {get, post}