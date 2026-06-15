def findDifference(N, arr):
    odd = 0
    even = 0
    for i in range(N):
        if arr[i] % 2 == 0:
            even += arr[i]
        else:
            odd += arr[i]
        
    return even - odd