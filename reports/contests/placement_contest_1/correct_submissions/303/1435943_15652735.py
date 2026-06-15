vector<long long> nextGreaterElement(const vector<long long>& arr) {
    int n=arr.size();
    vector<long long> nex(n);
    vector<long long> st;
    for (int i=(n-1);i>=0;i--) {
        while (st.size() && st.back() <= arr[i]) st.pop_back();
        if (st.size())
            nex[i]=st.back();
        else
            nex[i]=-1;
        st.push_back(arr[i]);
    }
    return nex;
}