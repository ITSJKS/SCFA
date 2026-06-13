def findDifference(N, nums):
    s1=0
    for i in range(len(nums)):
        if nums[i]%2==0:
            s1+=nums[i]
    s2=0
    for j in range(len(nums)):
        if nums[j]%2!=0:
            s2+=nums[j]
    return s1-s2