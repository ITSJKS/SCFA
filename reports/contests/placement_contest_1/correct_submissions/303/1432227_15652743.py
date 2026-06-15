def nextGreaterElement(arr):
    st = []
    ans = [-1]*len(arr)
    for i in range(len(arr)-1,-1,-1):
        while len(st) > 0 and st[-1] <= arr[i]:
            st.pop(-1)
        if len(st) > 0:
            ans[i] = st[-1]
        st.append(arr[i])
    print(*ans)