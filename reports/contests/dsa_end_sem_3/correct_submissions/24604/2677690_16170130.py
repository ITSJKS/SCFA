def findDifference(N, nums):
    even = 0
    odd = 0
    for i in range(N):
        if arr[i] % 2 == 0:
            even += arr[i]
        else:
            odd += arr[i]
    
    ans = even - odd
    return ans