vector<long long> nextGreaterElement(const vector<long long>& arr) {
    stack<long long> s;
    long long n = arr.size();
    for(long long  i = n-1;i >= 0;i--){
        s.push(arr[i]);
    }

    vector<long long> ans (n,-1);
    for(int i = 0;i<n;i++){
        vector<long long> temp;
        while (!s.empty() && arr[i] >= s.top()){
            long long t  = s.top();
            temp.push_back(t);
            s.pop();
        }
        
        if(!s.empty()){
            ans[i] = s.top();
        }

        reverse(temp.begin(),temp.end());
        for(int i = 0;i<temp.size()-1;i++){
            s.push(temp[i]);
        }

    }

    return ans;
}