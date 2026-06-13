def isPresent(n, nums, target):
    try:
        return nums.index(target)
    except ValueError:
        return -1
    #write your code here
    # s=0
    # e=n-1
    # def BinS(nums,target,s,e):
    #     m=(s+e)//2
    #         if nums[m]==target:
    #             return m
    
    #         elif nums[m]>target:
    #             e=m-1
    #             BinS(nums,target,s,e)
    #         elif nums[m]<target:
    #             s=m+1
    #             BinS(nums,target,s,e)
    #         else:
    #             return -1
    # BinS(nums,target,s,e)