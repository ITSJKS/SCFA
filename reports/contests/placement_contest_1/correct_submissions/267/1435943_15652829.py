def trap(arr):
    pmax=arr[::]
    smax=arr[::]
    for i in range(1, len(arr)):
        pmax[i]=max(pmax[i], pmax[i-1])
    for i in range(len(arr)-2, -1, -1):
        smax[i]=max(smax[i], smax[i+1])
    ans = 0
    for i in range(len(arr)):
        ans+=min(pmax[i], smax[i])-arr[i]
    return ans