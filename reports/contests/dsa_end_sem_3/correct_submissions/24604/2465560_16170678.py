def findDifference(N, nums):
    ods = 0
    evs = 0
    for i in range(len(nums)):
        if nums[i]%2==0:
            evs+=nums[i]
        else:
            ods+=nums[i]
    return (evs-ods)