def trap(arr):
    n = len(arr)
    p = arr[:]
    for i in range(1,n):
        p[i] = max(p[i],p[i-1])
    s = arr[:]
    for i in range(n-2,-1,-1):
        s[i] = max(s[i],s[i+1])
    
    total = 0
    for i in range(n):
        total += min(p[i],s[i])-arr[i]
        
    return total