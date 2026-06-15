def trap(arr):
    n = len(arr)
    p = [0]*n
    s = [0]*n
    st = []
    for i in range(n):
        while len(st) > 0 and st[-1] <= arr[i]:
            st.pop(-1)
        if len(st) > 0:
            p[i] = st[-1]
        st.append(arr[i])
    st = []
    for i in range(n-1,-1,-1):
        while len(st) > 0 and st[-1] <= arr[i]:
            st.pop(-1)
        if len(st) > 0:
            s[i] = st[-1]
        st.append(arr[i])
    for i in range(1,n):
        p[i] = max(p[i],p[i-1])
    for i in range(n-2,-1,-1):
        s[i] = max(s[i],s[i+1])
    total = 0
    for i in range(n):
        total += max(0,min(p[i],s[i])-arr[i])
    return total