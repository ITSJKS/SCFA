def findDifference(N, nums):
    e=0
    o=0
    for i in range(N):
        if nums[i]%2==0:
            e=e+nums[i]
        else:
            o=o+nums[i]
    return(e-o)