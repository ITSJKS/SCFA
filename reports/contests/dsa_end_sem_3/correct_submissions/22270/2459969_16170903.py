def isPresent(n, nums, target):
    #write your code here
    if target in nums:
        return nums.index(target)
    else:
        return -1