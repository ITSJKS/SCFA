def trap(arr):
    n = len(arr)
    prev = [0]*n
    nxt = [0]*n
    st = []
    for i in range(n):
        while len(st) > 0 and st[-1] <= arr[i]:
            st.pop(-1)
        if len(st) > 0:
            prev[i] = st[-1]
        st.append(arr[i])
    st = []
    for i in range(n-1,-1,-1):
        while len(st) > 0 and st[-1] <= arr[i]:
            st.pop(-1)
        if len(st) > 0:
            nxt[i] = st[-1]
        st.append(arr[i])
    for i in range(1,n):
        prev[i] = max(prev[i-1],prev[i])
    for i in range(n-2,-1,-1):
        nxt[i] = max(nxt[i],nxt[i+1])
    total = 0
    # print(prev)
    # print(nxt)
    # print(arr)
    for i in range(n):
        total += max(0,min(prev[i],nxt[i])-arr[i])
    return total