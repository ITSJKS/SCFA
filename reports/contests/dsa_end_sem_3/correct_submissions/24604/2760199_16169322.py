def findDifference(N, nums):
    c_odd=0
    c_eve=0
    for i in range(N):
        if nums[i]%2==0:
            c_eve += nums[i]
        else:
            c_odd += nums[i]
            
    return (c_eve-c_odd)